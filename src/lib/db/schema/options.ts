import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
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

export const productOptionsRelations = relations(productOptions, ({ one, many }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
  values: many(productOptionValues),
}));

export const productOptionValuesRelations = relations(productOptionValues, ({ one }) => ({
  option: one(productOptions, {
    fields: [productOptionValues.optionId],
    references: [productOptions.id],
  }),
}));
