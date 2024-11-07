import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePerfilInput } from './create-perfil.input';

@InputType()
export class UpdatePerfilInput extends PartialType(CreatePerfilInput) {}
