import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../database/drizzle.provider';
import * as schema from '../../database/schema/schema';
import { createJid } from '../../common/utils/phone-number.util';

@Injectable()
export class MessagePersistenceService {
  private readonly logger = new Logger(MessagePersistenceService.name);

  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async saveOutgoingMessage(params: {
    metaMessageId: string;
    recipientNumber: string;
    message: Record<string, any>;
    messageType: string;
    instanceId: string;
    webhookUrl?: string;
  }) {
    const remoteJid = createJid(params.recipientNumber);

    const [saved] = await this.db.insert(schema.messages).values({
      key: { fromMe: true, id: params.metaMessageId, remoteJid },
      messageType: params.messageType,
      message: params.message,
      source: 'unknown',
      messageTimestamp: Math.round(Date.now() / 1000),
      instanceId: params.instanceId,
      webhookUrl: params.webhookUrl,
      status: 'PENDING',
    }).returning();

    return saved;
  }

  async saveIncomingMessage(params: {
    metaMessageId: string;
    fromNumber: string;
    pushName?: string;
    message: Record<string, any>;
    messageType: string;
    messageTimestamp: number;
    instanceId: string;
    fromMe: boolean;
  }) {
    const remoteJid = createJid(params.fromNumber);

    const [saved] = await this.db.insert(schema.messages).values({
      key: { fromMe: params.fromMe, id: params.metaMessageId, remoteJid },
      pushName: params.pushName,
      messageType: params.messageType,
      message: params.message,
      source: 'unknown',
      messageTimestamp: params.messageTimestamp,
      instanceId: params.instanceId,
      status: 'RECEIVED',
    }).returning();

    return saved;
  }

  async saveStatusUpdate(params: {
    keyId: string;
    remoteJid: string;
    fromMe: boolean;
    status: string;
    messageId: string;
    instanceId: string;
  }) {
    const [saved] = await this.db.insert(schema.messageStatusUpdates).values(params).returning();
    return saved;
  }
}
