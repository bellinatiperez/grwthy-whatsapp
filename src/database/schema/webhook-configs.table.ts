import { pgTable, varchar, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { instances } from './instances.table';

export const webhookConfigs = pgTable('webhook_configs', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  url: varchar('url', { length: 500 }).notNull(),
  headers: jsonb('headers'),
  enabled: boolean('enabled').default(true).notNull(),
  events: jsonb('events'),
  webhookByEvents: boolean('webhook_by_events').default(false).notNull(),
  webhookBase64: boolean('webhook_base64').default(false).notNull(),
  instanceId: varchar('instance_id', { length: 128 }).notNull().unique().references(() => instances.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type WebhookConfig = typeof webhookConfigs.$inferSelect;
export type NewWebhookConfig = typeof webhookConfigs.$inferInsert;
