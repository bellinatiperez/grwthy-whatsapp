import { Inject, Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';
import { CacheService } from '../../cache/cache.service';
import { CreateInstanceDto } from './dto/create-instance.dto';

@Injectable()
export class InstanceService {
  private readonly logger = new Logger(InstanceService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly cache: CacheService,
  ) {}

  async create(dto: CreateInstanceDto, userId?: string, businessAccountRefId?: string) {
    const existing = await this.db
      .select()
      .from(schema.instances)
      .where(eq(schema.instances.name, dto.instanceName))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException(`Instance "${dto.instanceName}" already exists`);
    }

    // Resolve businessAccountId and accessToken from business_accounts table
    let businessAccountId = dto.businessAccountId;
    let accessToken = dto.accessToken;
    let resolvedRefId = businessAccountRefId;

    if (!businessAccountId && businessAccountRefId) {
      const [ba] = await this.db
        .select()
        .from(schema.businessAccounts)
        .where(eq(schema.businessAccounts.id, businessAccountRefId))
        .limit(1);

      if (!ba) {
        throw new BadRequestException('Business Account not found');
      }

      businessAccountId = ba.businessAccountId;
      accessToken = ba.accessToken;
    }

    if (!businessAccountId || !accessToken) {
      throw new BadRequestException('businessAccountId and accessToken are required');
    }

    const [instance] = await this.db
      .insert(schema.instances)
      .values({
        name: dto.instanceName,
        phoneNumberId: dto.phoneNumberId,
        businessAccountId,
        accessToken,
        businessAccountRefId: resolvedRefId,
        apiKey: dto.apiKey,
        userId,
      })
      .returning();

    if (dto.webhook?.url) {
      await this.db.insert(schema.webhookConfigs).values({
        url: dto.webhook.url,
        headers: dto.webhook.headers,
        enabled: dto.webhook.enabled ?? true,
        events: dto.webhook.events,
        webhookByEvents: dto.webhook.webhookByEvents ?? false,
        webhookBase64: dto.webhook.webhookBase64 ?? false,
        instanceId: instance.id,
      });
    }

    await this.db.insert(schema.instanceSettings).values({ instanceId: instance.id });

    await this.cacheInstance(instance);
    this.logger.log(`Instance "${dto.instanceName}" created`);
    return instance;
  }

  async findByName(name: string) {
    const cached = await this.cache.get<schema.Instance>(`instance:name:${name}`);
    if (cached) return cached;

    const [instance] = await this.db
      .select()
      .from(schema.instances)
      .where(eq(schema.instances.name, name))
      .limit(1);

    if (!instance) {
      throw new NotFoundException(`Instance "${name}" not found`);
    }

    await this.cacheInstance(instance);
    return instance;
  }

  async findByPhoneNumberId(phoneNumberId: string) {
    const cached = await this.cache.get<schema.Instance>(`instance:phone:${phoneNumberId}`);
    if (cached) return cached;

    const [instance] = await this.db
      .select()
      .from(schema.instances)
      .where(eq(schema.instances.phoneNumberId, phoneNumberId))
      .limit(1);

    if (!instance) return null;

    await this.cacheInstance(instance);
    return instance;
  }

  async findAll() {
    return this.db.select().from(schema.instances);
  }

  async findByBusinessAccountRefId(businessAccountRefId: string) {
    return this.db
      .select()
      .from(schema.instances)
      .where(eq(schema.instances.businessAccountRefId, businessAccountRefId));
  }

  async remove(name: string) {
    const instance = await this.findByName(name);
    await this.db.delete(schema.instances).where(eq(schema.instances.id, instance.id));
    await this.cache.del(`instance:name:${name}`);
    await this.cache.del(`instance:phone:${instance.phoneNumberId}`);
    this.logger.log(`Instance "${name}" deleted`);
    return { deleted: true };
  }

  private async cacheInstance(instance: schema.Instance): Promise<void> {
    await this.cache.set(`instance:name:${instance.name}`, instance);
    await this.cache.set(`instance:phone:${instance.phoneNumberId}`, instance);
  }
}
