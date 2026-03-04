import { Inject, Injectable } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';

@Injectable()
export class ChatService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findMessages(instance: schema.Instance) {
    return this.db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.instanceId, instance.id))
      .orderBy(desc(schema.messages.messageTimestamp))
      .limit(100);
  }

  async findConversations(instance: schema.Instance) {
    return this.db
      .select()
      .from(schema.chats)
      .where(eq(schema.chats.instanceId, instance.id));
  }

  async markAsRead(instance: schema.Instance, remoteJid: string) {
    await this.db
      .update(schema.chats)
      .set({ unreadMessages: 0 })
      .where(
        and(
          eq(schema.chats.instanceId, instance.id),
          eq(schema.chats.remoteJid, remoteJid),
        ),
      );
  }
}
