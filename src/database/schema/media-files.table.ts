import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { instances } from './instances.table';
import { messages } from './messages.table';

export const mediaFiles = pgTable('media_files', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  fileName: varchar('file_name', { length: 500 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  mimetype: varchar('mimetype', { length: 100 }).notNull(),
  messageId: varchar('message_id', { length: 128 }).notNull().unique().references(() => messages.id, { onDelete: 'cascade' }),
  instanceId: varchar('instance_id', { length: 128 }).notNull().references(() => instances.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type MediaFile = typeof mediaFiles.$inferSelect;
export type NewMediaFile = typeof mediaFiles.$inferInsert;
