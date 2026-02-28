import { Inject, Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';
import { InstanceService } from '../instance/instance.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
    private readonly instanceService: InstanceService,
  ) {}

  async findMessages(instanceName: string) {
    const instance = await this.instanceService.findByName(instanceName);
    return this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.instanceId, instance.id))
      .orderBy(desc(schema.messages.messageTimestamp))
      .limit(100);
  }

  async findConversations(instanceName: string) {
    const instance = await this.instanceService.findByName(instanceName);
    return this.db
      .select()
      .from(schema.chats)
      .where(eq(schema.chats.instanceId, instance.id));
  }
}
