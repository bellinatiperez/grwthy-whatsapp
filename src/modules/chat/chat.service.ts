import { Inject, Injectable } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
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

  private resolveInstance(name: string) {
    return this.instanceService.findByName(name);
  }

  async findMessages(instanceName: string) {
    const { id } = await this.resolveInstance(instanceName);
    return this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.instanceId, id))
      .orderBy(desc(schema.messages.messageTimestamp))
      .limit(100);
  }

  async findConversations(instanceName: string) {
    const { id } = await this.resolveInstance(instanceName);
    return this.db
      .select()
      .from(schema.chats)
      .where(eq(schema.chats.instanceId, id));
  }

  async markAsRead(instanceName: string, remoteJid: string) {
    const { id } = await this.resolveInstance(instanceName);
    await this.db
      .update(schema.chats)
      .set({ unreadMessages: 0 })
      .where(
        and(
          eq(schema.chats.instanceId, id),
          eq(schema.chats.remoteJid, remoteJid),
        ),
      );
  }
}
