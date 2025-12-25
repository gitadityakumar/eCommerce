import { jsonb, numeric, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';
import { productOptionValues } from './options';
import { products } from './products';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  sku: text('sku').notNull().unique(),
  price: numeric('price', { precision: 15, scale: 2 }).notNull(), // INR precision
  salePrice: numeric('sale_price', { precision: 15, scale: 2 }),
  weight: real('weight'),
  dimensions: jsonb('dimensions'),
  colorId: uuid('color_id').references(() => colors.id, { onDelete: 'set null' }),
  sizeId: uuid('size_id').references(() => sizes.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const variantOptions = pgTable('variant_options', {
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }).notNull(),
  optionValueId: uuid('option_value_id').references(() => productOptionValues.id, { onDelete: 'cascade' }).notNull(),
}, t => ({
  pk: [t.variantId, t.optionValueId],
}));

export const insertVariantSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1),
  price: z.string(),
  salePrice: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  dimensions: z
    .object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .partial()
    .optional()
    .nullable(),
  colorId: z.string().uuid().optional().nullable(),
  sizeId: z.string().uuid().optional().nullable(),
  createdAt: z.date().optional(),
});
export const selectVariantSchema = insertVariantSchema.extend({
  id: z.string().uuid(),
});
export type InsertVariant = z.infer<typeof insertVariantSchema>;
export type SelectVariant = z.infer<typeof selectVariantSchema>;
