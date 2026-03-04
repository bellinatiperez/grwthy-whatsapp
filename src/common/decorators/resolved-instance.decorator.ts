import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ResolvedInstance = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const instance = request.instance;
    return data ? instance?.[data] : instance;
  },
);
