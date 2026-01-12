import { boolean, decimal, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const storeSettings = pgTable('store_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeName: text('store_name').notNull().default('My Store'),
  storeEmail: text('store_email'),
  storePhone: text('store_phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  country: text('country').default('India'),

  // Tax Info
  isTaxEnabled: boolean('is_tax_enabled').default(false).notNull(),
  taxName: text('tax_name').default('GST'),
  taxPercentage: decimal('tax_percentage', { precision: 10, scale: 2 }).default('0.00').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
