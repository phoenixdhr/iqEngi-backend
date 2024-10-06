import { ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
// import { IS_PUBLC_KEY } from '../../decorators/public.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtGqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    return request;
  }
}
