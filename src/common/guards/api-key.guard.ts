import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['apikey'] as string;
    const globalKey = this.configService.get<string>('app.apiKey');

    if (!globalKey) return true;

    if (!apiKey || apiKey !== globalKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
