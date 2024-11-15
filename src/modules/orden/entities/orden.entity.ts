import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { Usuario } from '../../usuario/entities/usuario.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { EstadoOrden } from '../../../common/enums/estado-orden.enum';
import { IOrden } from '../interfaces/orden.interface';

import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';
import { AuditFields } from 'src/common/clases/audit-fields.class';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Orden extends AuditFields implements IOrden {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Usuario)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => [Curso])
  @Prop({
    type: [
      {
        cursoId: { type: Types.ObjectId, ref: Curso.name },
        precio: { type: Number, required: true },
      },
    ],
    required: true,
  })
  cursos: Array<{ cursoId: Types.ObjectId; precio: number }>;

  @Field()
  @Prop({ required: true, default: Date.now })
  fechaCreacion: Date;

  @Field({ nullable: true })
  @Prop()
  fechaActualizacion?: Date;

  @Field(() => Float)
  @Prop({ required: true })
  montoTotal: number;

  @Field(() => EstadoOrden)
  @Prop({ enum: EstadoOrden, default: EstadoOrden.Pendiente })
  estado_orden: EstadoOrden;
}

export const OrdenSchema = SchemaFactory.createForClass(Orden);

OrdenSchema.pre('save', function (next) {
  this.montoTotal = this.cursos.reduce((acc, curso) => acc + curso.precio, 0);
  this.fechaActualizacion = new Date();
  next();
});

OrdenSchema.index({ usuarioId: 1 });
OrdenSchema.index({ deleted: 1 });
OrdenSchema.index({ 'cursos.cursoId': 1 });

addSoftDeleteMiddleware<Orden, Orden>(OrdenSchema);
