import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './user';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').references(() => users.id, { onDelete: 'set null' }),
  entityType: text('entity_type').notNull(), // e.g., 'product', 'order', 'coupon'
  entityId: uuid('entity_id').notNull(),
  action: text('action').notNull(), // e.g., 'create', 'update', 'delete'
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
