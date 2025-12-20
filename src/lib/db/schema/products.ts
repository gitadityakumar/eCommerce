import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { brands } from './brands';
import { categories } from './categories';
import { genders } from './filters/genders';

export const productStatusEnum = pgEnum('product_status', ['draft', 'published', 'archived']);

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  genderId: uuid('gender_id').references(() => genders.id, { onDelete: 'set null' }),
  brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'set null' }),
  status: productStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
}));

export const insertProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().uuid().optional().nullable(),
  genderId: z.string().uuid().optional().nullable(),
  brandId: z.string().uuid().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const selectProductSchema = insertProductSchema.extend({
  id: z.string().uuid(),
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SelectProduct = z.infer<typeof selectProductSchema>;
