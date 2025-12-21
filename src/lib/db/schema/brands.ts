import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
});

export const insertBrandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal('')).nullable(),
});
export const selectBrandSchema = insertBrandSchema.extend({
  id: z.string().uuid(),
});
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type SelectBrand = z.infer<typeof selectBrandSchema>;
