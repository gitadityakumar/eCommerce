import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createShiprocketOrder } from '@/actions/shipping';
import { db } from '@/lib/db';
import { orders, payments } from '@/lib/db/schema';
import { verifySignature } from '@/lib/phonepe/client';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const xVerify = req.headers.get('x-verify');

    if (!xVerify || !rawBody.response) {
      return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }

    const saltKey = process.env.PHONEPE_CLIENT_SECRET!;
    const saltIndex = process.env.PHONEPE_CLIENT_VERSION || '1';

    // Verify Checksum
    // For callback, PhonePe sends { response: "base64..." }
    // Signature Check: SHA256(response + saltKey) + ### + saltIndex
    if (!verifySignature(rawBody.response, xVerify, saltKey, saltIndex)) {
      console.error('PhonePe Checksum Failed');
      return NextResponse.json({ error: 'Verification Failed' }, { status: 400 });
    }

    const decodedData = JSON.parse(Buffer.from(rawBody.response, 'base64').toString('utf-8'));
    // console.log('PhonePe Webhook Data:', JSON.stringify(decodedData, null, 2));

    const { code, data } = decodedData;
    const { merchantTransactionId } = data;

    // Find Payment Record
    const payment = await db.query.payments.findFirst({
      where: eq(payments.merchantTransactionId, merchantTransactionId),
      with: {
        order: {
          with: {
            items: true,
          },
        },
      },
    });

    if (!payment) {
      console.error('Payment record not found for:', merchantTransactionId);
      return NextResponse.json({ error: 'Payment Not Found' }, { status: 404 });
    }

    if (code === 'PAYMENT_SUCCESS') {
      // 1. Update Payment
      await db.update(payments).set({
        status: 'completed',
        transactionId: data.transactionId,
        paidAt: new Date(),
        rawPayload: decodedData,
      }).where(eq(payments.id, payment.id));

      // 2. Update Order (Idempotency Check)
      if (payment.order.status !== 'paid') {
        await db.update(orders).set({
          status: 'paid',
          updatedAt: new Date(),
        }).where(eq(orders.id, payment.orderId));

        // 3. Decrement Inventory (Atomic)
        // We loop through items and decrement stock.
        // Ideally use a single transaction.
        await db.transaction(async (tx) => {
          for (const item of payment.order.items) {
            await tx.execute(sql`
                    UPDATE inventory_levels 
                    SET available = available - ${item.quantity}
                    WHERE variant_id = ${item.productVariantId}
                `);
          }
        });

        // 4. Create Shiprocket Order (Async - don't block webhook response if possible, but reliability matters)
        // We'll await it to ensure we capture error logs.
        try {
          await createShiprocketOrder(payment.orderId);
        }
        catch (srError) {
          console.error('Failed to create Shiprocket Order from Webhook:', srError);
          // We still return success to PhonePe to stop retries if payment is confirmed.
        }
      }
    }
    else {
      // Payment Failed
      await db.update(payments).set({
        status: 'failed',
        rawPayload: decodedData,
      }).where(eq(payments.id, payment.id));

      // Optionally cancel order or leave as pending?
      // If failed, user might retry. Leaving as pending is safer?
      // But if explicitly failed, we can mark failed.
      if (code === 'PAYMENT_ERROR') {
        await db.update(orders).set({ status: 'failed' }).where(eq(orders.id, payment.orderId));
      }
    }

    return NextResponse.json({ success: true });
  }
  catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
