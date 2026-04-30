'use server';

import { and, eq, gte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { clearCartAction, getCartAction } from '@/lib/actions/storefront-cart';
import { db } from '@/lib/db';
import { addresses, coupons, inventoryLevels, orderItems, orders, payments, storeSettings } from '@/lib/db/schema';
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit';
import { getRateLimitedUserContext } from '@/lib/security/request-context';
import { checkShippingServiceability } from './shipping';

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
  _courierPrice: number,
  _courierName: string,
  _taxAmount: number = 0,
  _couponDiscount: number = 0,
  couponCode?: string,
) {
  const { user, ip } = await getRateLimitedUserContext();
  const limit = checkRateLimit(rateLimitKey('payment', `${user.id}:${ip}`), 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return { success: false, error: 'Too many payment attempts' };
  }

  const cart = await getCartAction();

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const [shippingAddress, billingAddress] = await Promise.all([
    db.query.addresses.findFirst({
      where: and(eq(addresses.id, shippingAddressId), eq(addresses.userId, user.id)),
    }),
    db.query.addresses.findFirst({
      where: and(eq(addresses.id, billingAddressId), eq(addresses.userId, user.id)),
    }),
  ]);

  if (!shippingAddress || !billingAddress) {
    throw new Error('Invalid address');
  }

  // 1. Calculate Total (Server-side validation)
  let subtotal = 0;
  for (const item of cart.items) {
    subtotal += Number(item.variant.salePrice || item.variant.price) * item.quantity;

    const inventory = await db.query.inventoryLevels.findFirst({
      where: and(eq(inventoryLevels.variantId, item.productVariantId), gte(inventoryLevels.available, item.quantity)),
    });

    if (!inventory) {
      throw new Error('One or more items are out of stock');
    }
  }

  const serviceability = await checkShippingServiceability(shippingAddress.postalCode, subtotal);
  if (!serviceability.success || !serviceability.data) {
    throw new Error(serviceability.error || 'Shipping is unavailable for this address');
  }

  const selectedCourier = serviceability.data.find((c: { id: string }) => c.id === courierId);
  if (!selectedCourier) {
    throw new Error('Invalid courier selection');
  }

  const settings = await db.select().from(storeSettings).limit(1).then(rows => rows[0] || null);
  let couponDiscount = 0;
  let normalizedCouponCode: string | undefined;

  if (couponCode?.trim()) {
    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, couponCode.trim().toUpperCase()),
    });

    const now = new Date();
    if (
      !coupon
      || coupon.startsAt > now
      || (coupon.expiresAt && coupon.expiresAt < now)
      || (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage)
      || (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount))
    ) {
      throw new Error('Invalid or expired promo code');
    }

    normalizedCouponCode = coupon.code;
    couponDiscount = coupon.discountType === 'percentage'
      ? (subtotal * Number(coupon.discountValue)) / 100
      : Number(coupon.discountValue);
    couponDiscount = Math.min(couponDiscount, subtotal);
  }

  const subtotalAfterDiscount = subtotal - couponDiscount;
  const taxAmount = settings?.isTaxEnabled
    ? (subtotalAfterDiscount * Number(settings.taxPercentage)) / 100
    : 0;
  const amount = subtotalAfterDiscount + selectedCourier.price + taxAmount;

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid order amount');
  }

  const merchantTransactionId = `MT${uuidv4().replace(/-/g, '').substring(0, 20)}`;

  // 2. Create Order (Pending)
  const [newOrder] = await db.insert(orders).values({
    userId: user?.id,
    status: 'pending',
    totalAmount: amount.toFixed(2),
    shippingAddressId,
    billingAddressId,
    courierName: selectedCourier.name,
    courierCompanyId: selectedCourier.id,
  }).returning({ id: orders.id });

  // 3. Create Order Items (Snapshot)
  for (const item of cart.items) {
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      priceAtPurchase: String(item.variant.salePrice || item.variant.price),
    });
  }

  // 4. Create Payment Record
  await db.insert(payments).values({
    orderId: newOrder.id,
    method: 'phonepe',
    status: 'initiated',
    merchantTransactionId,
    rawPayload: normalizedCouponCode
      ? { couponCode: normalizedCouponCode, couponDiscount, taxAmount, courierId: selectedCourier.id }
      : { taxAmount, courierId: selectedCourier.id },
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

    // V2 /checkout/v2/pay returns orderId and redirectUrl on success.
    if (data.orderId && data.redirectUrl) {
      // 7. Clear Cart (After successful redirect initiation)
      try {
        await clearCartAction();
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
