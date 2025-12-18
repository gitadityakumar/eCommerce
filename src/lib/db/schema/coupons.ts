import { pgEnum, pgTable, uuid, text, numeric, timestamp, integer } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { users } from './user';
import { orders } from './orders';

export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value', { precision: 15, scale: 2 }).notNull(),
  minOrderAmount: numeric('min_order_amount', { precision: 15, scale: 2 }).default('0'),
  startsAt: timestamp('starts_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  maxUsage: integer('max_usage'),
  usedCount: integer('used_count').notNull().default(0),
});

export const couponUsage = pgTable('coupon_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  couponId: uuid('coupon_id').references(() => coupons.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
});

export const insertCouponSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number(),
  minOrderAmount: z.number().optional(),
  startsAt: z.date().optional(),
  expiresAt: z.date().optional().nullable(),
  maxUsage: z.number().int().nonnegative().optional().nullable(),
  usedCount: z.number().int().nonnegative().optional(),
});
export const selectCouponSchema = insertCouponSchema.extend({
  id: z.string().uuid(),
});
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type SelectCoupon = z.infer<typeof selectCouponSchema>;
