import { pgTable, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const connectionStatusEnum = pgEnum('connection_status', ['open', 'close', 'connecting']);

export const instances = pgTable('instances', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }).notNull().unique(),
  connectionStatus: connectionStatusEnum('connection_status').default('open').notNull(),
  ownerJid: varchar('owner_jid', { length: 100 }),
  profileName: varchar('profile_name', { length: 100 }),
  profilePicUrl: varchar('profile_pic_url', { length: 500 }),
  phoneNumberId: varchar('phone_number_id', { length: 100 }).notNull(),
  businessAccountId: varchar('business_account_id', { length: 100 }).notNull(),
  accessToken: varchar('access_token', { length: 500 }).notNull(),
  apiKey: varchar('api_key', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Instance = typeof instances.$inferSelect;
export type NewInstance = typeof instances.$inferInsert;
