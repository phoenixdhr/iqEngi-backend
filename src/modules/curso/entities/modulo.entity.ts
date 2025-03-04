import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
// Eliminamos la importación de Unidad
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { IModulo } from '../interfaces/modulo.interface';
import { Coleccion } from 'src/common/enums';
import { Unidad, UnidadSchema } from './unidad.entity';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';
import { IdInterface } from 'src/common/interfaces/id.interface';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Modulo extends AuditFields implements IModulo, IdInterface {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Coleccion.Curso, required: true })
  cursoId: Types.ObjectId;

  @Field(() => Int)
  @Prop({ required: true })
  numeroModulo: number;

  @Field()
  @Prop({ required: true })
  moduloTitle: string;

  @Field({ nullable: true })
  @Prop()
  descripcion?: string;

  // Usamos IDs para las unidades y referenciamos como cadena de texto
  @Field(() => [Unidad], { nullable: true })
  @Prop({ type: [UnidadSchema], ref: Coleccion.Unidad, default: [] }) // se ha eliminado la referencia a Unidad ref: Coleccion.Unidad,
  unidades?: Unidad[];

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const ModuloSchema = SchemaFactory.createForClass(Modulo);

ModuloSchema.index(
  { cursoId: 1, numeroModulo: 1 },
  // , { unique: true }
);
ModuloSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<Modulo, Modulo>(ModuloSchema);
