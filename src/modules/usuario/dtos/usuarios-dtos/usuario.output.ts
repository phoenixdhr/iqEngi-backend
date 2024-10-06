import { ObjectType, OmitType } from '@nestjs/graphql';
import { Usuario } from '../../entities/usuario.entity';

@ObjectType()
export class UsuarioOutput extends OmitType(Usuario, [
  'hashPassword',
] as const) {}
