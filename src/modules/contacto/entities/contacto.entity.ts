import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

@ObjectType()
@Schema({ timestamps: true })
export class Contacto extends AuditFields {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  nombre: string;

  @Field()
  @Prop({ required: true, lowercase: true })
  email: string;

  @Field({ nullable: true })
  @Prop()
  empresa?: string;

  @Field()
  @Prop({ required: true })
  motivo: string;

  @Field()
  @Prop({ required: true })
  mensaje: string;

  @Field()
  @Prop({ default: false })
  newsletter: boolean;

  @Field()
  @Prop({ default: false })
  procesado: boolean;

  @Field()
  @Prop({ default: false })
  deleted: boolean;
}

export const ContactoSchema = SchemaFactory.createForClass(Contacto);

// Índices
ContactoSchema.index({ email: 1 });
ContactoSchema.index({ procesado: 1 });
ContactoSchema.index({ deleted: 1 });
ContactoSchema.index({ createdAt: -1 });

addSoftDeleteMiddleware<Contacto, Contacto>(ContactoSchema);
