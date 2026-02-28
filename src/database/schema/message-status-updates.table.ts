import { pgTable, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { instances } from './instances.table';
import { messages } from './messages.table';

export const messageStatusUpdates = pgTable('message_status_updates', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  keyId: varchar('key_id', { length: 100 }).notNull(),
  remoteJid: varchar('remote_jid', { length: 100 }).notNull(),
  fromMe: boolean('from_me').notNull(),
  participant: varchar('participant', { length: 100 }),
  status: varchar('status', { length: 30 }).notNull(),
  messageId: varchar('message_id', { length: 128 }).notNull().references(() => messages.id, { onDelete: 'cascade' }),
  instanceId: varchar('instance_id', { length: 128 }).notNull().references(() => instances.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('msg_status_instance_idx').on(table.instanceId),
]);

export type MessageStatusUpdate = typeof messageStatusUpdates.$inferSelect;
export type NewMessageStatusUpdate = typeof messageStatusUpdates.$inferInsert;
