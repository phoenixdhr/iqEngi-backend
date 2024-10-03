import { Field, InputType } from '@nestjs/graphql';
import { CreatePerfilDto } from '../usuario.dto';

@InputType()
export class CreatePerfilInput extends CreatePerfilDto {
  @Field()
  readonly bio?: string;

  @Field()
  readonly ubicacion?: string;

  @Field()
  readonly celular?: string;

  @Field()
  readonly fechaNacimiento?: Date;

  @Field()
  readonly imagenURL?: string;

  @Field()
  readonly contacto?: string;

  @Field(() => [String])
  readonly intereses?: string[];
}
