'use server';

import type { InsertCoupon } from '@/lib/db/schema/coupons';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';
import { db } from '@/lib/db';
import { coupons, insertCouponSchema } from '@/lib/db/schema/coupons';

export async function createCoupon(data: InsertCoupon) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized. Admin access required.' };
  }

  try {
    // Validate the data
    const validatedData = insertCouponSchema.parse({
      ...data,
      usedCount: 0,
    });

    // Check if code is unique
    const existingCoupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, validatedData.code),
    });

    if (existingCoupon) {
      return { error: 'Coupon code already exists.' };
    }

    // Insert the coupon
    // Note: Drizzle numeric type expects a string
    await db.insert(coupons).values({
      ...validatedData,
      discountValue: validatedData.discountValue.toString(),
      minOrderAmount: validatedData.minOrderAmount?.toString() || '0',
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  }
  catch (error: unknown) {
    console.error('Error creating coupon:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      // @ts-expect-error - zod error structure
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to create coupon. Please try again.' };
  }
}

export async function getCoupons() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized', data: [] };
  }

  try {
    const data = await db.query.coupons.findMany({
      orderBy: [desc(coupons.startsAt)],
    });
    return { data };
  }
  catch (error) {
    console.error('Error fetching coupons:', error);
    return { error: 'Failed to fetch coupons', data: [] };
  }
}

export async function deleteCoupon(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  try {
    await db.delete(coupons).where(eq(coupons.id, id));
    revalidatePath('/admin/coupons');
    return { success: true };
  }
  catch (error) {
    console.error('Error deleting coupon:', error);
    return { error: 'Failed to delete coupon' };
  }
}
