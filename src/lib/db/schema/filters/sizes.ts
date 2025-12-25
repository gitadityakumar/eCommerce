import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const sizes = pgTable('sizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  sortOrder: integer('sort_order').notNull(),
});

export const insertSizeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int(),
});
export const selectSizeSchema = insertSizeSchema.extend({
  id: z.string().uuid(),
});
export type InsertSize = z.infer<typeof insertSizeSchema>;
export type SelectSize = z.infer<typeof selectSizeSchema>;
