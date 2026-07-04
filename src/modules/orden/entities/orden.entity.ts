import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { Usuario } from '../../usuario/entities/usuario.entity';
import { EstadoOrden } from '../../../common/enums/estado-orden.enum';
import { IOrden } from '../interfaces/orden.interface';

import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { OrdenCursoItem } from './ordenCursoItem.entity';

@ObjectType()
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
export class Orden extends AuditFields implements IOrden {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => [OrdenCursoItem])
  @Prop({
    type: [OrdenCursoItem],
    required: true,
  })
  listaCursos: OrdenCursoItem[];

  @Field(() => Float)
  @Prop()
  montoTotal: number;

  @Field(() => EstadoOrden)
  @Prop({ enum: EstadoOrden, default: EstadoOrden.Pendiente })
  estado_orden: EstadoOrden;

  // Moneda en la que se realizó la transacción (código ISO 4217, ej: 'USD', 'PEN', 'BRL')
  @Field({ nullable: true })
  @Prop({ default: 'USD' })
  currency: string;

  @Field({ nullable: true })
  @Prop()
  externalPaymentId?: string;

  @Field({ nullable: true })
  @Prop()
  paymentUrl?: string;

  // GraphQLISODateTime es un tipo escalar de GraphQL que asegura que las fechas se serialicen y parseen
  // correctamente en formato estándar ISO-8601 (ej. "2023-10-25T14:30:00Z").
  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ index: true })
  expiresAt?: Date;

  // Indica qué pasarela está procesando el pago (ej. 'MERCADO_PAGO', 'STRIPE', 'PAYPAL')
  @Field({ nullable: true })
  @Prop()
  paymentProvider?: string;

  // NOTA: Por el momento este campo no se está utilizando ni guardando en ningún lado.
  // ID genérico para inicializar el checkout en cualquier pasarela (reemplaza a mpPreferenceId).
  @Field({ nullable: true })
  @Prop()
  checkoutSessionId?: string;

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const OrdenSchema = SchemaFactory.createForClass(Orden);

OrdenSchema.pre('save', function (next) {
  // Eliminar duplicados de listaCursos
  const uniqueCursos = new Map();
  this.listaCursos.forEach((curso) =>
    uniqueCursos.set(curso.cursoId.toString(), curso),
  );
  this.listaCursos = Array.from(uniqueCursos.values());

  // Calcular montoTotal

  this.montoTotal = this.listaCursos.reduce(
    (acc, curso) => acc + curso.precio * (1 - curso.descuento / 100),
    0,
  );
  next();
});

OrdenSchema.pre('save', function (next) {
  // Recalcular montoTotal al guardar un documento
  this.montoTotal = this.listaCursos.reduce(
    (acc, curso) => acc + curso.precio * (1 - curso.descuento / 100),
    0,
  );
  next();
});

OrdenSchema.index({ usuarioId: 1 });
OrdenSchema.index({ deleted: 1 });
OrdenSchema.index({ 'cursos.cursoId': 1 });
OrdenSchema.index(
  { _id: 1, 'listaCursos.cursoId': 1 }, // Índice compuesto
  {
    unique: true,
    partialFilterExpression: { 'listaCursos.cursoId': { $exists: true } },
  },
);

addSoftDeleteMiddleware<Orden, Orden>(OrdenSchema);
