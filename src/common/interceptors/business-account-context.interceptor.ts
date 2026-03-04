import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InstanceService } from '../../modules/instance/instance.service';

@Injectable()
export class BusinessAccountContextInterceptor implements NestInterceptor {
  constructor(private readonly instanceService: InstanceService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const instanceName = request.params.instanceName;

    if (instanceName) {
      const instance = await this.instanceService.findByName(instanceName);
      request.instance = instance;
      request.businessAccountRefId = instance.businessAccountRefId;
    }

    return next.handle();
  }
}
