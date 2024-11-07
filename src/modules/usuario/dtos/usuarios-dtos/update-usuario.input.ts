import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateUsuarioInput } from './create-usuario.input';

@InputType()
export class UpdateUsuarioInput extends PartialType(
  OmitType(CreateUsuarioInput, ['password', 'email'] as const),
) {}
