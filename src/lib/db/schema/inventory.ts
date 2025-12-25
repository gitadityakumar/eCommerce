import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { productVariants } from './variants';

export const stockLedgerReasonEnum = pgEnum('stock_ledger_reason', [
  'sale',
  'return',
  'manual_adjustment',
  'damage',
  'restock',
]);

export const inventoryLevels = pgTable('inventory_levels', {
  variantId: uuid('variant_id')
    .primaryKey()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
  available: integer('available').notNull().default(0),
  reserved: integer('reserved').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stockLedger = pgTable('stock_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }).notNull(),
  changeAmount: integer('change_amount').notNull(),
  reason: stockLedgerReasonEnum('reason').notNull(),
  referenceType: text('reference_type'), // e.g., 'order', 'audit_log'
  referenceId: uuid('reference_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
