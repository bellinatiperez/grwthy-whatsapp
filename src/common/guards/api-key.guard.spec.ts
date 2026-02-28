import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let configService: { get: jest.Mock };

  beforeEach(() => {
    configService = { get: jest.fn() };
    guard = new ApiKeyGuard(configService as unknown as ConfigService);
  });

  function createContext(apiKey?: string) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: apiKey !== undefined ? { apikey: apiKey } : {},
        }),
      }),
    } as any;
  }

  it('should allow access when no global API key is configured', () => {
    configService.get.mockReturnValue(undefined);
    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('should allow access when apikey matches', () => {
    configService.get.mockReturnValue('secret-key');
    expect(guard.canActivate(createContext('secret-key'))).toBe(true);
  });

  it('should throw UnauthorizedException when apikey is missing', () => {
    configService.get.mockReturnValue('secret-key');
    expect(() => guard.canActivate(createContext())).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when apikey is wrong', () => {
    configService.get.mockReturnValue('secret-key');
    expect(() => guard.canActivate(createContext('wrong-key'))).toThrow(
      UnauthorizedException,
    );
  });
});
