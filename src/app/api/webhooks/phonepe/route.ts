'use server';

import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { and, eq, gte, ne, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createShiprocketOrder } from '@/actions/shipping';
import { db } from '@/lib/db';
import { inventoryLevels, orders, payments } from '@/lib/db/schema';
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit';

// PhonePe V2 Webhook credentials (configured in dashboard)
const WEBHOOK_USERNAME = process.env.PHONEPE_WEBHOOK_USERNAME;
const WEBHOOK_PASSWORD = process.env.PHONEPE_WEBHOOK_PASSWORD;

function verifyV2Authorization(authHeader: string | null): boolean {
  if (!authHeader || !WEBHOOK_USERNAME || !WEBHOOK_PASSWORD)
    return false;

  // PhonePe sends: Authorization: SHA256(username:password)
  const expectedHash = crypto
    .createHash('sha256')
    .update(`${WEBHOOK_USERNAME}:${WEBHOOK_PASSWORD}`)
    .digest('hex');

  // The header might be just the hash or prefixed
  const receivedHash = authHeader.replace(/^SHA256\s*/i, '').trim();

  const expected = Buffer.from(expectedHash.toLowerCase(), 'utf8');
  const received = Buffer.from(receivedHash.toLowerCase(), 'utf8');

  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

interface PhonePeV2Webhook {
  event: 'checkout.order.completed' | 'checkout.order.failed' | 'pg.refund.completed' | 'pg.refund.failed';
  payload: {
    orderId: string;
    merchantId: string;
    merchantOrderId: string;
    state: 'COMPLETED' | 'FAILED' | 'PENDING';
    amount: number;
    expireAt: number;
    metaInfo?: Record<string, string>;
    paymentDetails?: Array<{
      paymentMode: string;
      transactionId: string;
      timestamp: number;
      amount: number;
      state: string;
    }>;
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';
    const limit = checkRateLimit(rateLimitKey('phonepe-webhook', ip), 120, 15 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const rawBody: PhonePeV2Webhook = await req.json();
    const authHeader = req.headers.get('authorization');

    console.warn('PhonePe V2 Webhook Received:', {
      headers: {
        'authorization': authHeader ? '[PRESENT]' : '[MISSING]',
        'content-type': req.headers.get('content-type'),
      },
      event: rawBody.event,
      merchantOrderId: rawBody.payload?.merchantOrderId,
      state: rawBody.payload?.state,
    });

    if (!verifyV2Authorization(authHeader)) {
      console.warn('PhonePe V2 Authorization verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { event, payload } = rawBody;

    if (!payload?.merchantOrderId) {
      console.error('PhonePe V2 Webhook: Missing merchantOrderId');
      return NextResponse.json({ error: 'Missing merchantOrderId' }, { status: 400 });
    }

    // Find Payment Record by merchantOrderId (which we stored as merchantTransactionId)
    const payment = await db.query.payments.findFirst({
      where: eq(payments.merchantTransactionId, payload.merchantOrderId),
      with: {
        order: {
          with: {
            items: true,
          },
        },
      },
    });

    if (!payment) {
      console.error('Payment record not found for:', payload.merchantOrderId);
      return NextResponse.json({ error: 'Payment Not Found' }, { status: 404 });
    }

    const expectedAmount = Math.round(Number(payment.order.totalAmount) * 100);
    if (payload.amount !== expectedAmount) {
      console.error('PhonePe V2 amount mismatch:', {
        merchantOrderId: payload.merchantOrderId,
        expectedAmount,
        receivedAmount: payload.amount,
      });
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }

    // Handle events
    if (event === 'checkout.order.completed' && payload.state === 'COMPLETED') {
      // Payment Success
      const transactionId = payload.paymentDetails?.[0]?.transactionId || payload.orderId;
      let shouldCreateShipment = false;

      await db.transaction(async (tx) => {
        await tx.update(payments).set({
          status: 'completed',
          transactionId,
          paidAt: new Date(),
          rawPayload: rawBody,
        }).where(eq(payments.id, payment.id));

        const [updatedOrder] = await tx.update(orders).set({
          status: 'paid',
          updatedAt: new Date(),
        }).where(and(eq(orders.id, payment.orderId), ne(orders.status, 'paid'))).returning();

        if (updatedOrder) {
          for (const item of payment.order.items) {
            const [updatedInventory] = await tx.update(inventoryLevels)
              .set({
                available: sql`${inventoryLevels.available} - ${item.quantity}`,
                updatedAt: new Date(),
              })
              .where(and(
                eq(inventoryLevels.variantId, item.productVariantId),
                gte(inventoryLevels.available, item.quantity),
              ))
              .returning();

            if (!updatedInventory) {
              throw new Error(`Insufficient inventory for variant ${item.productVariantId}`);
            }
          }

          shouldCreateShipment = true;
        }
      });

      if (shouldCreateShipment) {
        try {
          await createShiprocketOrder(payment.orderId);
        }
        catch (srError) {
          console.error('Failed to create Shiprocket Order from Webhook:', srError);
        }
      }

      console.warn('PhonePe V2 Payment Success for order:', payment.orderId);
    }
    else if (event === 'checkout.order.failed' || payload.state === 'FAILED') {
      if (payment.status === 'completed' || payment.order.status === 'paid') {
        return NextResponse.json({ success: true });
      }

      // Payment Failed
      await db.update(payments).set({
        status: 'failed',
        rawPayload: rawBody,
      }).where(eq(payments.id, payment.id));

      await db.update(orders).set({ status: 'failed' }).where(eq(orders.id, payment.orderId));

      console.warn('PhonePe V2 Payment Failed for order:', payment.orderId);
    }
    else {
      console.warn('PhonePe V2 Webhook: Unhandled event or state:', { event, state: payload.state });
    }

    return NextResponse.json({ success: true });
  }
  catch (error: any) {
    console.error('PhonePe V2 Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
