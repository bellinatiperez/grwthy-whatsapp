import { pgTable, varchar, timestamp, pgEnum, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { businessAccounts } from './business-accounts.table';

export const businessAccountRoleEnum = pgEnum('business_account_role', ['owner', 'admin', 'member']);

export const businessAccountMembers = pgTable('business_account_members', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  businessAccountId: varchar('business_account_id', { length: 128 })
    .notNull()
    .references(() => businessAccounts.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull(),
  role: businessAccountRoleEnum('role').default('member').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  unique('bam_account_user_unique').on(table.businessAccountId, table.userId),
]);

export type BusinessAccountMember = typeof businessAccountMembers.$inferSelect;
export type NewBusinessAccountMember = typeof businessAccountMembers.$inferInsert;
