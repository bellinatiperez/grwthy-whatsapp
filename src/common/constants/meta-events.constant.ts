export enum MetaEvent {
  MESSAGES_UPSERT = 'messages.upsert',
  MESSAGES_UPDATE = 'messages.update',
  MESSAGES_DELETE = 'messages.delete',
  SEND_MESSAGE = 'send.message',
  CONTACTS_UPSERT = 'contacts.upsert',
  CONTACTS_UPDATE = 'contacts.update',
  CONNECTION_UPDATE = 'connection.update',
  INSTANCE_CREATE = 'instance.create',
  INSTANCE_DELETE = 'instance.delete',
  TEMPLATE_STATUS_UPDATE = 'template.status.update',
}

export const MESSAGE_STATUS = {
  0: 'ERROR',
  1: 'PENDING',
  2: 'SERVER_ACK',
  3: 'DELIVERY_ACK',
  4: 'READ',
  5: 'PLAYED',
} as const;
