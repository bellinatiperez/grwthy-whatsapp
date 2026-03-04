import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ResolvedBusinessAccount = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ba = request.businessAccount;
    return data ? ba?.[data] : ba;
  },
);
