import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RolEnum } from '../enums/roles.model';
import { UserRequest } from '../entities/type-gql/user_jwt.entity';

export const CurrentUser = createParamDecorator(
  (rolesDecorator: RolEnum[] = [], context: ExecutionContext) => {
    // Obtener el contexto de GraphQL
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user as UserRequest;

    // Verificar si el usuario está presente
    if (!user) {
      throw new InternalServerErrorException(
        'Usuario no encontrado - asegúrate de usar un AuthGuard',
      );
    }

    // Verificar si el usuario tiene roles asignados
    if (!user.roles || !Array.isArray(user.roles)) {
      throw new InternalServerErrorException(
        'No se han asignado roles al usuario',
      );
    }

    // Si no se requieren roles específicos, devolver el usuario
    if (rolesDecorator.length === 0) {
      return user;
    }

    // Obtener los roles del usuario
    const rolesUser = user.roles as RolEnum[];

    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = rolesUser.some((rolUser) =>
      rolesDecorator.includes(rolUser),
    );

    // Si el usuario tiene el rol, devolver el usuario
    if (hasRole) {
      return user;
    }

    // Si el usuario no tiene el rol necesario, lanzar excepción
    throw new UnauthorizedException(
      `El usuario ${user.email} con persmisos ${user.roles} no tiene permisos suficientes ${rolesDecorator}`,
    );
  },
);
