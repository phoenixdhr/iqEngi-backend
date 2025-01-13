import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { ICursosItemOrden } from '../interfaces/orden.interface';

@ObjectType()
export class OrdenCursoItem implements ICursosItemOrden {
  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Field(() => Float)
  @Prop({ required: true })
  precio: number;

  @Field()
  @Prop({ required: true })
  courseTitle: string;

  @Field(() => Float, { nullable: true })
  @Prop({ default: 0 })
  descuento?: number;
}
