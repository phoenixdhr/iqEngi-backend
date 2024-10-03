import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ICurso } from '../curso.interfaz';
import { Nivel } from '../curso.entity';
import { Types } from 'mongoose';
import { Instructor } from 'src/instructor/entities/instructor.entity';
import { EstructuraProgramaria } from 'src/estructura-programaria/entities/estructura-programaria.entity';

@ObjectType()
export class CursoType implements ICurso {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field()
  descripcionCorta: string;

  @Field(() => String, { nullable: true })
  nivel?: Nivel;

  @Field(() => ID, { nullable: true })
  instructor?: Types.ObjectId | Instructor;

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
  estructuraProgramaria:
    | Types.Array<Types.ObjectId>
    | Types.DocumentArray<EstructuraProgramaria>;

  @Field({ nullable: true })
  fechaLanzamiento?: Date;

  @Field(() => [ID], { defaultValue: [] })
  categorias: Types.Array<Types.ObjectId>;
}
