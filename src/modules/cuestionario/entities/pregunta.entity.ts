import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TipoPregunta } from 'src/common/enums/tipo-pregunta.enum';
import { Opcion, OpcionSchema } from './opcion.entity';
import { Types } from 'mongoose';
import { Modulo } from 'src/modules/curso/entities/modulo.entity';
import { Unidad } from 'src/modules/curso/entities/unidad.entity';
import { IPregunta } from '../interfaces/pregunta.interface';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';
import { IdInterface } from 'src/common/interfaces/id.interface';

// #region Pregunta
@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Pregunta extends AuditFields implements IPregunta, IdInterface {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({ nullable: true })
  @Prop()
  enunciado: string;

  @Field(() => TipoPregunta, { nullable: true })
  @Prop({ required: true, enum: TipoPregunta })
  tipoPregunta: TipoPregunta;

  @Field(() => [Opcion], { nullable: true })
  @Prop({ type: [OpcionSchema], default: [] })
  opciones?: Opcion[];

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Modulo.name })
  moduloId?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Unidad.name })
  unidadId?: Types.ObjectId;

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const PreguntaSchema = SchemaFactory.createForClass(Pregunta);

PreguntaSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Pregunta, Pregunta>(PreguntaSchema);
