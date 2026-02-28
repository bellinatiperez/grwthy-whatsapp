export function parseContactMessage(message: any): any {
  const contacts = message.contacts || [];
  return {
    contacts: contacts.map((c: any) => ({
      name: c.name?.formatted_name,
      phones: c.phones?.map((p: any) => p.phone),
      emails: c.emails?.map((e: any) => e.email),
      org: c.org?.company,
    })),
  };
}
