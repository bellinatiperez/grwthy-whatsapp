import { pgTable, varchar, integer, jsonb, timestamp, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { instances } from './instances.table';

export const chats = pgTable('chats', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  remoteJid: varchar('remote_jid', { length: 100 }).notNull(),
  name: varchar('name', { length: 100 }),
  labels: jsonb('labels'),
  unreadMessages: integer('unread_messages').default(0).notNull(),
  instanceId: varchar('instance_id', { length: 128 }).notNull().references(() => instances.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  unique('chats_jid_instance_unique').on(table.instanceId, table.remoteJid),
]);

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
