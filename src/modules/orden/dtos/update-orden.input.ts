// orden/dtos/update-orden.input.ts

import { InputType, PartialType } from '@nestjs/graphql';
import { CreateOrdenInput } from './create-orden.input';

@InputType()
export class UpdateOrdenInput extends PartialType(CreateOrdenInput) {}
