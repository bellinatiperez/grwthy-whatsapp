import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';
import { MetaApiClient } from '../../shared/meta-api/meta-api.client';
import { InstanceService } from '../instance/instance.service';
import { CreateTemplateDto, EditTemplateDto, DeleteTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly metaApiClient: MetaApiClient,
    private readonly instanceService: InstanceService,
  ) {}

  async findAll(instanceName: string) {
    const instance = await this.instanceService.findByName(instanceName);
    const result = await this.metaApiClient.listTemplates(instance.businessAccountId, instance.accessToken);
    return result.data;
  }

  async create(instanceName: string, dto: CreateTemplateDto) {
    const instance = await this.instanceService.findByName(instanceName);

    const result = await this.metaApiClient.createTemplate(instance.businessAccountId, instance.accessToken, {
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
    });

    return result;
  }

  async edit(instanceName: string, dto: EditTemplateDto) {
    const instance = await this.instanceService.findByName(instanceName);
    return this.metaApiClient.editTemplate(dto.templateId, instance.accessToken, {
      components: dto.components,
    });
  }

  async remove(instanceName: string, dto: DeleteTemplateDto) {
    const instance = await this.instanceService.findByName(instanceName);

    const result = await this.metaApiClient.deleteTemplate(instance.businessAccountId, instance.accessToken, {
      name: dto.name,
      hsm_id: dto.hsmId,
    });

    await this.db
      .delete(schema.templates)
      .where(and(eq(schema.templates.name, dto.name), eq(schema.templates.instanceId, instance.id)));

    return result;
  }
}
