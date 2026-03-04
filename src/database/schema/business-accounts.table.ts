import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const businessAccounts = pgTable('business_accounts', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: varchar('name', { length: 255 }).notNull(),
  businessAccountId: varchar('business_account_id', { length: 100 }).notNull().unique(),
  accessToken: varchar('access_token', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type BusinessAccount = typeof businessAccounts.$inferSelect;
export type NewBusinessAccount = typeof businessAccounts.$inferInsert;
