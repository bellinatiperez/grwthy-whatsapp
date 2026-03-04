import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import { CreateTemplateDto, EditTemplateDto, DeleteTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly metaApiClient: MetaApiClient,
  ) {}

  async findAll(instance: schema.Instance) {
    const result = await this.metaApiClient.listTemplates(instance.businessAccountId!, instance.accessToken!);
    return result.data;
  }

  async findAllByBusinessAccount(ba: schema.BusinessAccount) {
    const result = await this.metaApiClient.listTemplates(ba.businessAccountId, ba.accessToken);
    return result.data;
  }

  async create(instance: schema.Instance, dto: CreateTemplateDto) {
    const result = await this.metaApiClient.createTemplate(instance.businessAccountId!, instance.accessToken!, {
      name: dto.name,
      category: dto.category,
      allow_category_change: dto.allowCategoryChange,
      language: dto.language,
      components: dto.components,
    });

    await this.db.insert(schema.templates).values({
      templateId: result.id,
      name: dto.name,
      category: dto.category,
      language: dto.language,
      template: dto.components,
      instanceId: instance.id,
      businessAccountRefId: instance.businessAccountRefId,
    });

    return result;
  }

  async createForBusinessAccount(ba: schema.BusinessAccount, dto: CreateTemplateDto) {
    const result = await this.metaApiClient.createTemplate(ba.businessAccountId, ba.accessToken, {
      name: dto.name,
      category: dto.category,
      allow_category_change: dto.allowCategoryChange,
      language: dto.language,
      components: dto.components,
    });

    await this.db.insert(schema.templates).values({
      templateId: result.id,
      name: dto.name,
      category: dto.category,
      language: dto.language,
      template: dto.components,
      businessAccountRefId: ba.id,
    });

    return result;
  }

  async edit(instance: schema.Instance, dto: EditTemplateDto) {
    return this.metaApiClient.editTemplate(dto.templateId, instance.accessToken!, {
      components: dto.components,
    });
  }

  async editForBusinessAccount(ba: schema.BusinessAccount, dto: EditTemplateDto) {
    return this.metaApiClient.editTemplate(dto.templateId, ba.accessToken, {
      components: dto.components,
    });
  }

  async remove(instance: schema.Instance, dto: DeleteTemplateDto) {
    const result = await this.metaApiClient.deleteTemplate(instance.businessAccountId!, instance.accessToken!, {
      name: dto.name,
      hsm_id: dto.hsmId,
    });

    await this.db
      .delete(schema.templates)
      .where(and(eq(schema.templates.name, dto.name), eq(schema.templates.instanceId, instance.id)));

    return result;
  }

  async removeForBusinessAccount(ba: schema.BusinessAccount, dto: DeleteTemplateDto) {
    const result = await this.metaApiClient.deleteTemplate(ba.businessAccountId, ba.accessToken, {
      name: dto.name,
      hsm_id: dto.hsmId,
    });

    await this.db
      .delete(schema.templates)
      .where(and(eq(schema.templates.name, dto.name), eq(schema.templates.businessAccountRefId, ba.id)));

    return result;
  }
}
