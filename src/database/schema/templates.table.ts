import { pgTable, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { instances } from './instances.table';

export const templates = pgTable('templates', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  templateId: varchar('template_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }),
  language: varchar('language', { length: 20 }),
  template: jsonb('template').notNull(),
  webhookUrl: varchar('webhook_url', { length: 500 }),
  instanceId: varchar('instance_id', { length: 128 }).notNull().references(() => instances.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
