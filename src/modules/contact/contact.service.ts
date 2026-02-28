import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';
import { InstanceService } from '../instance/instance.service';

@Injectable()
export class ContactService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly instanceService: InstanceService,
  ) {}

  async findAll(instanceName: string) {
    const instance = await this.instanceService.findByName(instanceName);
    return this.db
      .select()
      .from(schema.contacts)
      .where(eq(schema.contacts.instanceId, instance.id));
  }
}
