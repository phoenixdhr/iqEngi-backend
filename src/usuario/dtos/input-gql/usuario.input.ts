import { Field, InputType, PartialType } from '@nestjs/graphql';
import { RolEnum } from 'src/auth/enums/roles.model';
import { CreatePerfilInput } from './perfil.input';
import { CreateCursoCompradoInput } from './cursos-comprados.inpput';
import { CreateUsuarioDto, UserPasswordDto } from '../usuario.dto';

@InputType()
export class CreateUsuarioInput extends CreateUsuarioDto {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  email_verified: boolean = false;

  @Field()
  password: string;

  @Field(() => [RolEnum])
  roles: RolEnum[] = [RolEnum.ESTUDIANTE]; // Valor por defecto

  @Field(() => CreatePerfilInput, { nullable: true })
  perfil: CreatePerfilInput;

  @Field(() => [CreateCursoCompradoInput], { nullable: true })
  cursos_comprados: [CreateCursoCompradoInput];

  @Field(() => Boolean, { nullable: true })
  notificaciones?: boolean = true;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean = true;
}

@InputType()
export class UpdateUsuarioInput extends PartialType(CreateUsuarioInput) {}

@InputType()
export class UserPasswordInput extends UserPasswordDto {
  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}
