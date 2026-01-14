import { integer, numeric, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { addresses } from './addresses';
import { users } from './user';
import { productVariants } from './variants';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'paid',
  'partially_shipped',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
  'failed',
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: numeric('total_amount', { precision: 15, scale: 2 }).notNull(), // INR precision
  shippingAddressId: uuid('shipping_address_id').references(() => addresses.id, { onDelete: 'set null' }),
  billingAddressId: uuid('billing_address_id').references(() => addresses.id, { onDelete: 'set null' }),
  shiprocketOrderId: text('shiprocket_order_id'),
  shiprocketShipmentId: text('shiprocket_shipment_id'),
  awbCode: text('awb_code'),
  courierName: text('courier_name'),
  courierCompanyId: text('courier_company_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fulfillments = pgTable('fulfillments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  trackingNumber: text('tracking_number'),
  carrier: text('carrier'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productVariantId: uuid('product_variant_id').references(() => productVariants.id, { onDelete: 'restrict' }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  priceAtPurchase: numeric('price_at_purchase', { precision: 15, scale: 2 }).notNull(), // INR precision
});

export const insertOrderSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  status: z
    .enum([
      'pending',
      'processing',
      'paid',
      'partially_shipped',
      'shipped',
      'delivered',
      'cancelled',
      'returned',
      'refunded',
      'failed',
    ])
    .optional(),
  totalAmount: z.number(),
  shippingAddressId: z.string().uuid().optional().nullable(),
  billingAddressId: z.string().uuid().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const selectOrderSchema = insertOrderSchema.extend({
  id: z.string().uuid(),
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type SelectOrder = z.infer<typeof selectOrderSchema>;

export const insertOrderItemSchema = z.object({
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
  priceAtPurchase: z.number(),
});
export const selectOrderItemSchema = insertOrderItemSchema.extend({
  id: z.string().uuid(),
});
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type SelectOrderItem = z.infer<typeof selectOrderItemSchema>;
