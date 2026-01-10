'use server';

import { and, eq, gte, lte, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema/coupons';

export async function validateCoupon(code: string, amount: number) {
  try {
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
