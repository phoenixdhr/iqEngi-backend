// usuario/dtos/update-usuario.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUsuarioInput } from './create-usuario.input';

@InputType()
export class UpdateUsuarioInput extends PartialType(CreateUsuarioInput) {}
