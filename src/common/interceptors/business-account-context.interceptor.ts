import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InstanceService } from '../../modules/instance/instance.service';
import { BusinessAccountService } from '../../modules/business-account/business-account.service';

@Injectable()
export class BusinessAccountContextInterceptor implements NestInterceptor {
  constructor(
    private readonly instanceService: InstanceService,
    private readonly businessAccountService: BusinessAccountService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const instanceName = request.params.instanceName;
    const baId = request.headers['x-business-account-id'];

    if (instanceName) {
      const instance = await this.instanceService.findByName(instanceName);
      if (baId && instance.businessAccountRefId !== baId) {
        throw new NotFoundException(`Instance "${instanceName}" not found`);
      }
      request.instance = instance;
      request.businessAccountRefId = instance.businessAccountRefId;
    }

    // Resolve business account from header when no instance param
    if (baId && !request.businessAccount) {
      const ba = await this.businessAccountService.findById(baId);
      request.businessAccount = ba;
      request.businessAccountRefId = ba.id;
    }

    return next.handle();
  }
}
