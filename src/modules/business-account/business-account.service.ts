import { Inject, Injectable, Logger, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';
import { CacheService } from '../../cache/cache.service';
import { CreateBusinessAccountDto } from './dto/create-business-account.dto';

@Injectable()
export class BusinessAccountService {
  private readonly logger = new Logger(BusinessAccountService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly cache: CacheService,
  ) {}

  async create(dto: CreateBusinessAccountDto, userId: string) {
    const existing = await this.db
      .select()
      .from(schema.businessAccounts)
      .where(eq(schema.businessAccounts.businessAccountId, dto.businessAccountId))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException(`Business Account "${dto.businessAccountId}" already exists`);
    }

    const [account] = await this.db
      .insert(schema.businessAccounts)
      .values({
        name: dto.name,
        businessAccountId: dto.businessAccountId,
        accessToken: dto.accessToken,
      })
      .returning();

    await this.db.insert(schema.businessAccountMembers).values({
      businessAccountId: account.id,
      userId,
      role: 'owner',
    });

    await this.cacheAccount(account);
    this.logger.log(`Business Account "${dto.name}" created by user ${userId}`);
    return account;
  }

  async findById(id: string) {
    const cached = await this.cache.get<schema.BusinessAccount>(`ba:id:${id}`);
    if (cached) return cached;

    const [account] = await this.db
      .select()
      .from(schema.businessAccounts)
      .where(eq(schema.businessAccounts.id, id))
      .limit(1);

    if (!account) {
      throw new NotFoundException(`Business Account not found`);
    }

    await this.cacheAccount(account);
    return account;
  }

  async findByMetaId(businessAccountId: string) {
    const cached = await this.cache.get<schema.BusinessAccount>(`ba:meta:${businessAccountId}`);
    if (cached) return cached;

    const [account] = await this.db
      .select()
      .from(schema.businessAccounts)
      .where(eq(schema.businessAccounts.businessAccountId, businessAccountId))
      .limit(1);

    if (!account) return null;

    await this.cacheAccount(account);
    return account;
  }

  async findForUser(userId: string) {
    const rows = await this.db
      .select({ account: schema.businessAccounts, role: schema.businessAccountMembers.role })
      .from(schema.businessAccountMembers)
      .innerJoin(schema.businessAccounts, eq(schema.businessAccountMembers.businessAccountId, schema.businessAccounts.id))
      .where(eq(schema.businessAccountMembers.userId, userId));

    return rows.map((r) => ({ ...r.account, role: r.role }));
  }

  async addMember(accountId: string, userId: string, role: 'owner' | 'admin' | 'member' = 'member') {
    await this.findById(accountId);

    const existing = await this.db
      .select()
      .from(schema.businessAccountMembers)
      .where(
        and(
          eq(schema.businessAccountMembers.businessAccountId, accountId),
          eq(schema.businessAccountMembers.userId, userId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('User is already a member of this account');
    }

    const [member] = await this.db
      .insert(schema.businessAccountMembers)
      .values({ businessAccountId: accountId, userId, role })
      .returning();

    this.logger.log(`User ${userId} added to account ${accountId} as ${role}`);
    return member;
  }

  async removeMember(accountId: string, userId: string) {
    await this.db
      .delete(schema.businessAccountMembers)
      .where(
        and(
          eq(schema.businessAccountMembers.businessAccountId, accountId),
          eq(schema.businessAccountMembers.userId, userId),
        ),
      );

    this.logger.log(`User ${userId} removed from account ${accountId}`);
  }

  async verifyAccess(accountId: string, userId: string) {
    const [membership] = await this.db
      .select()
      .from(schema.businessAccountMembers)
      .where(
        and(
          eq(schema.businessAccountMembers.businessAccountId, accountId),
          eq(schema.businessAccountMembers.userId, userId),
        ),
      )
      .limit(1);

    if (!membership) {
      throw new ForbiddenException('No access to this business account');
    }

    return this.findById(accountId);
  }

  private async cacheAccount(account: schema.BusinessAccount): Promise<void> {
    await this.cache.set(`ba:id:${account.id}`, account);
    await this.cache.set(`ba:meta:${account.businessAccountId}`, account);
  }
}
