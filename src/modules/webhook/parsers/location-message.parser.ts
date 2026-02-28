export function parseLocationMessage(message: any): any {
  const loc = message.location || {};
  return {
    degreesLatitude: loc.latitude,
    degreesLongitude: loc.longitude,
    name: loc.name,
    address: loc.address,
  };
}
