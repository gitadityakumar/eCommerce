'use server';

import type { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createShiprocketOrder } from '@/actions/shipping';
import { db } from '@/lib/db';
import { orders, payments } from '@/lib/db/schema';

// PhonePe V2 Webhook credentials (configured in dashboard)
const WEBHOOK_USERNAME = process.env.PHONEPE_WEBHOOK_USERNAME || 'testuser';
const WEBHOOK_PASSWORD = process.env.PHONEPE_WEBHOOK_PASSWORD || 'testuser123';

function verifyV2Authorization(authHeader: string | null): boolean {
  if (!authHeader)
    return false;

  // PhonePe sends: Authorization: SHA256(username:password)
  const expectedHash = crypto
    .createHash('sha256')
    .update(`${WEBHOOK_USERNAME}:${WEBHOOK_PASSWORD}`)
    .digest('hex');

  // The header might be just the hash or prefixed
  const receivedHash = authHeader.replace(/^SHA256\s*/i, '').trim();

  return receivedHash.toLowerCase() === expectedHash.toLowerCase();
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

    // Verify authorization (optional but recommended)
    if (!verifyV2Authorization(authHeader)) {
      console.warn('PhonePe V2 Authorization verification failed or skipped');
      // In production, you may want to reject unauthorized requests
      // For now, we log and continue to debug
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

    // Handle events
    if (event === 'checkout.order.completed' && payload.state === 'COMPLETED') {
      // Payment Success
      const transactionId = payload.paymentDetails?.[0]?.transactionId || payload.orderId;

      await db.update(payments).set({
        status: 'completed',
        transactionId,
        paidAt: new Date(),
        rawPayload: rawBody,
      }).where(eq(payments.id, payment.id));

      // Update Order (Idempotency Check)
      if (payment.order.status !== 'paid') {
        await db.update(orders).set({
          status: 'paid',
          updatedAt: new Date(),
        }).where(eq(orders.id, payment.orderId));

        // Decrement Inventory (Atomic)
        await db.transaction(async (tx) => {
          for (const item of payment.order.items) {
            await tx.execute(sql`
              UPDATE inventory_levels 
              SET available = available - ${item.quantity}
              WHERE variant_id = ${item.productVariantId}
            `);
          }
        });

        // Create Shiprocket Order
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
