import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // Convertir el ExecutionContext al contexto de GraphQL
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Retornar el usuario del request
    return request.user;
  },
);
