import { pgTable, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { instances } from './instances.table';

export const instanceSettings = pgTable('instance_settings', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  readMessages: boolean('read_messages').default(false).notNull(),
  groupsIgnore: boolean('groups_ignore').default(false).notNull(),
  instanceId: varchar('instance_id', { length: 128 }).notNull().unique().references(() => instances.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type InstanceSetting = typeof instanceSettings.$inferSelect;
export type NewInstanceSetting = typeof instanceSettings.$inferInsert;
