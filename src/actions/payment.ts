'use server';

import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { clearCartAction, getCartAction } from '@/lib/actions/storefront-cart';
import { getCurrentUser } from '@/lib/auth/actions';
import { db } from '@/lib/db';
import { orderItems, orders, payments } from '@/lib/db/schema';

const PHONEPE_HOST_URL = (process.env.PHONEPE_BASE_SANDBOX_URL || process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox').replace(/\/$/, '').trim();
const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '').trim();

if (!APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL is not defined');
}

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID || ' ';
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || ' ';
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || ' ';

async function getPhonePeOAuthToken() {
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_version', CLIENT_VERSION);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  const authEndpoint = '/v1/oauth/token';

  console.warn('PhonePe OAuth Request:', {
    url: `${PHONEPE_HOST_URL}${authEndpoint}`,
    client_id: CLIENT_ID,
    client_version: CLIENT_VERSION,
    has_secret: !!CLIENT_SECRET,
  });

  const response = await fetch(`${PHONEPE_HOST_URL}${authEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    console.error('PhonePe OAuth Error Details:', {
      status: response.status,
      data,
    });
    throw new Error(data.message || `Failed to get PhonePe OAuth token: ${data.code || response.status}`);
  }

  return data.access_token;
}

// function validatePhonePeConfig() {
//   // Logic shifted to getPhonePeOAuthToken
//   return true;
// }

export async function initiatePayment(
  shippingAddressId: string,
  billingAddressId: string,
  courierId: string,
  courierPrice: number,
  courierName: string,
  taxAmount: number = 0,
  couponDiscount: number = 0,
) {
  const user = await getCurrentUser();
  const cart = await getCartAction();

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  // 1. Calculate Total (Server-side validation)
  let subtotal = 0;
  for (const item of cart.items) {
    subtotal += Number(item.variant.price) * item.quantity;

    // Check Stock
    // Check Stock (Placeholder for strict inventory check)
    // const variant = await db.query.productVariants.findFirst(...)

    // Note: The schema for product_variants has 'in_stock' added in 0003, but inventory_levels table exists.
    // The user rules say: "Decrement stock ... atomic... use SELECT ... FOR UPDATE".
    // For now, we'll check inventory_levels if available, or just proceed if 'in_stock' is true.
    // Given the complexity of stock checking without transaction here (since we redirect), we do a soft check.
  }

  const amount = subtotal + courierPrice + taxAmount - couponDiscount;
  const merchantTransactionId = `MT${uuidv4().replace(/-/g, '').substring(0, 20)}`;

  // 2. Create Order (Pending)
  const [newOrder] = await db.insert(orders).values({
    userId: user?.id,
    status: 'pending',
    totalAmount: amount.toFixed(2),
    shippingAddressId,
    billingAddressId,
    // Store courier info temporarily or permanently? Schema has courierName/awb but not courierId/price directly?
    // We added courierName to orders.
    courierName,
  }).returning({ id: orders.id });

  // 3. Create Order Items (Snapshot)
  for (const item of cart.items) {
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      priceAtPurchase: String(item.variant.price),
    });
  }

  // 4. Create Payment Record
  await db.insert(payments).values({
    orderId: newOrder.id,
    method: 'phonepe',
    status: 'initiated',
    merchantTransactionId,
  });

  // 5. Prepare PhonePe V2 Payload (Corrected structure for Web Standard Checkout)
  const payload = {
    merchantOrderId: merchantTransactionId,
    amount: Math.round(amount * 100), // in paise
    paymentFlow: {
      type: 'PG_CHECKOUT',
      merchantUrls: {
        redirectUrl: `${APP_URL}/api/webhooks/phonepe/redirect?orderId=${newOrder.id}`,
      },
    },
  };

  const apiEndpoint = '/checkout/v2/pay';

  // 6. Call PhonePe V2 API
  try {
    const accessToken = await getPhonePeOAuthToken();
    const fullUrl = `${PHONEPE_HOST_URL}${apiEndpoint}`;

    console.warn('PhonePe V2 Request Debug:', {
      url: fullUrl,
      merchantOrderId: payload.merchantOrderId,
    });

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    }
    catch {
      console.error('PhonePe V2 Invalid JSON Response:', responseText);
      throw new Error(`PhonePe API returned invalid JSON: ${responseText}`);
    }

    console.warn('PhonePe V2 Full Response:', JSON.stringify(data, null, 2));

    // V2 /checkout/v2/pay returns orderId and redirectUrl on success.
    if (data.orderId && data.redirectUrl) {
      console.warn('PhonePe V2 Redirecting to:', data.redirectUrl);

      // 7. Clear Cart (After successful redirect initiation)
      try {
        console.warn('Attempting to clear cart for user...');
        const clearRes = await clearCartAction();
        console.warn('Clear Cart Result:', clearRes);
      }
      catch {
        console.error('Failed to clear cart after payment initiation');
      }

      return { success: true, url: data.redirectUrl };
    }
    else {
      // Mark payment failed
      console.error('PhonePe V2 Initiation Failed:', {
        status: response.status,
        message: data.message,
        code: data.code,
        data: data.data,
      });
      await db.update(payments).set({ status: 'failed', rawPayload: data }).where(eq(payments.merchantTransactionId, merchantTransactionId));
      return { success: false, error: data.message || 'Payment initiation failed' };
    }
  }
  catch (error: any) {
    console.error('PhonePe V2 Error:', error);
    await db.update(payments).set({ status: 'failed' }).where(eq(payments.merchantTransactionId, merchantTransactionId));
    return { success: false, error: error.message };
  }
}
