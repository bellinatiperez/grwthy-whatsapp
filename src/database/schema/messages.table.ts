import { pgTable, varchar, integer, jsonb, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { instances } from './instances.table';

export const deviceSourceEnum = pgEnum('device_source', ['ios', 'android', 'web', 'unknown', 'desktop']);

export const messages = pgTable('messages', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  key: jsonb('key').notNull(),
  pushName: varchar('push_name', { length: 100 }),
  participant: varchar('participant', { length: 100 }),
  messageType: varchar('message_type', { length: 100 }).notNull(),
  message: jsonb('message').notNull(),
  contextInfo: jsonb('context_info'),
  source: deviceSourceEnum('source').default('unknown').notNull(),
  messageTimestamp: integer('message_timestamp').notNull(),
  instanceId: varchar('instance_id', { length: 128 }).notNull().references(() => instances.id, { onDelete: 'cascade' }),
  webhookUrl: varchar('webhook_url', { length: 500 }),
  status: varchar('status', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('messages_instance_id_idx').on(table.instanceId),
  index('messages_timestamp_idx').on(table.messageTimestamp),
]);

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
