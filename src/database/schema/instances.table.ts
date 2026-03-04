import { pgTable, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { businessAccounts } from './business-accounts.table';

export const connectionStatusEnum = pgEnum('connection_status', ['open', 'close', 'connecting']);

export const instances = pgTable('instances', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }).notNull(),
  connectionStatus: connectionStatusEnum('connection_status').default('open').notNull(),
  ownerJid: varchar('owner_jid', { length: 100 }),
  profileName: varchar('profile_name', { length: 100 }),
  profilePicUrl: varchar('profile_pic_url', { length: 500 }),
  phoneNumberId: varchar('phone_number_id', { length: 100 }).notNull(),
  businessAccountRefId: varchar('business_account_ref_id', { length: 128 })
    .references(() => businessAccounts.id, { onDelete: 'cascade' }),
  // deprecated — migrating to business_accounts table
  businessAccountId: varchar('business_account_id', { length: 100 }),
  accessToken: varchar('access_token', { length: 500 }),
  apiKey: varchar('api_key', { length: 255 }),
  userId: varchar('user_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Instance = typeof instances.$inferSelect;
export type NewInstance = typeof instances.$inferInsert;
