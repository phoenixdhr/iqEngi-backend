import { Field, ID, InputType } from '@nestjs/graphql';
import { Nivel } from '../../entities/curso.entity';

import { CreateCursoDto } from '../cursos.dto';

@InputType()
export class CursoInput extends CreateCursoDto {
  @Field(() => String)
  title: string;

  @Field()
  descripcionCorta: string;

  @Field(() => String, { nullable: true })
  nivel?: Nivel;

  @Field(() => ID, { nullable: true })
  instructor?: string;

  @Field({ nullable: true })
  duracionHoras?: number;

  @Field({ nullable: true })
  imagenURL?: string;

  @Field({ nullable: true })
  precio?: number;

  @Field({ nullable: true })
  descuentos?: number;

  @Field({ nullable: true })
  calificacion?: number;

  @Field(() => [String], { defaultValue: [] })
  aprenderas: string[];

  @Field(() => [String], { defaultValue: [] })
  objetivos: string[];

  @Field(() => [String], { defaultValue: [] })
  dirigidoA: string[];

  @Field(() => [ID], { defaultValue: [] })
  estructuraProgramaria: [string];

  @Field({ nullable: true })
  fechaLanzamiento?: Date;

  @Field(() => [ID], { defaultValue: [] })
  categorias: [string];
}
