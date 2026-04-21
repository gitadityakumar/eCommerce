'use server';

import { and, eq, gte, lte, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema/coupons';
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit';

export async function validateCoupon(code: string, amount: number) {
  try {
    const requestHeaders = await headers();
    const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
      || requestHeaders.get('x-real-ip')
      || 'unknown';
    const limit = checkRateLimit(rateLimitKey('coupon', ip), 30, 15 * 60 * 1000);
    if (!limit.ok) {
      return { success: false, error: 'Too many promo code attempts' };
    }

    if (!code?.trim() || !Number.isFinite(amount) || amount <= 0) {
      return { success: false, error: 'Invalid promo code' };
    }

    const coupon = await db.query.coupons.findFirst({
      where: and(
        eq(coupons.code, code.toUpperCase()),
        lte(coupons.startsAt, new Date()),
        or(eq(coupons.expiresAt, sql`NULL`), gte(coupons.expiresAt, new Date())),
      ),
    });

    if (!coupon) {
      return { success: false, error: 'Invalid or expired promo code' };
    }

    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
      return { success: false, error: 'This promo code has reached its usage limit' };
    }

    if (coupon.minOrderAmount && amount < Number(coupon.minOrderAmount)) {
      return {
        success: false,
        error: `Minimum order amount for this code is ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(coupon.minOrderAmount))}`,
      };
    }

    return {
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
      },
    };
  }
  catch (error) {
    console.error('Error validating coupon:', error);
    return { success: false, error: 'Failed to validate promo code' };
  }
}
