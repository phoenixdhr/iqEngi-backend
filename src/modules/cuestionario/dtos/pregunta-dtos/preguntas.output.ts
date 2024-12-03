import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { IPregunta } from '../../interfaces/pregunta.interface';
import { IdInterface } from 'src/common/interfaces/id.interface';
import { TipoPregunta } from 'src/common/enums';
import { Prop } from '@nestjs/mongoose';
import { Opcion, OpcionSchema } from '../../entities/opcion.entity';
import { Modulo } from 'src/modules/curso/entities/modulo.entity';
import { Types } from 'mongoose';
import { Unidad } from 'src/modules/curso/entities/unidad.entity';

// #region Pregunta
@ObjectType()
export class Preguntas extends AuditFields implements IPregunta, IdInterface {
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
