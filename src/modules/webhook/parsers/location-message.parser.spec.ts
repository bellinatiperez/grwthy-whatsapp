import { parseLocationMessage } from './location-message.parser';

describe('parseLocationMessage', () => {
  it('should parse location data', () => {
    const message = {
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
        name: 'São Paulo',
        address: 'SP, Brazil',
      },
    };

    expect(parseLocationMessage(message)).toEqual({
      degreesLatitude: -23.5505,
      degreesLongitude: -46.6333,
      name: 'São Paulo',
      address: 'SP, Brazil',
    });
  });

  it('should handle missing location gracefully', () => {
    expect(parseLocationMessage({})).toEqual({
      degreesLatitude: undefined,
      degreesLongitude: undefined,
      name: undefined,
      address: undefined,
    });
  });
});
