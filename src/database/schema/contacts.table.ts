import { pgTable, varchar, timestamp, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { instances } from './instances.table';

export const contacts = pgTable('contacts', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  remoteJid: varchar('remote_jid', { length: 100 }).notNull(),
  pushName: varchar('push_name', { length: 100 }),
  profilePicUrl: varchar('profile_pic_url', { length: 500 }),
  instanceId: varchar('instance_id', { length: 128 }).notNull().references(() => instances.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  unique('contacts_jid_instance_unique').on(table.remoteJid, table.instanceId),
]);

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
