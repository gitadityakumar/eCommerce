import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { products } from './products';

export const productOptions = pgTable('product_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(), // e.g., 'Color', 'Size', 'Material'
  sortOrder: integer('sort_order').notNull().default(0),
});

export const productOptionValues = pgTable('product_option_values', {
  id: uuid('id').primaryKey().defaultRandom(),
  optionId: uuid('option_id').references(() => productOptions.id, { onDelete: 'cascade' }).notNull(),
  value: text('value').notNull(), // e.g., 'Red', 'Large', 'Cotton'
  sortOrder: integer('sort_order').notNull().default(0),
});
