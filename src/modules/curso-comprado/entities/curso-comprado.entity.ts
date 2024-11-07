import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EstadoAccesoCurso } from 'src/common/enums/estado-acceso-curso.enum';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { ICursoComprado } from '../interfaces/curso-comprado.interface';
import { Document } from 'mongoose';
import { CreatedUpdatedDeletedBy } from 'src/common/interfaces/created-updated-deleted-by.interface';
import { Coleccion } from 'src/common/enums';
import { DocumentStatus } from 'src/common/enums/estado-documento';

// #region CursoComprado
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
@ObjectType()
export class CursoComprado
  extends Document
  implements ICursoComprado, CreatedUpdatedDeletedBy
{
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Usuario)
  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId: Types.ObjectId;

  @Field(() => Curso)
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  @Field()
  @Prop({ required: true, default: Date.now })
  fechaCompra: Date;

  @Field({ nullable: true })
  @Prop()
  fechaExpiracion?: Date;

  @Field(() => EstadoAccesoCurso)
  @Prop({ enum: EstadoAccesoCurso, default: EstadoAccesoCurso.Activo })
  estadoAcceso: EstadoAccesoCurso;

  @Field(() => Float, { defaultValue: 0 })
  @Prop({ default: 0 })
  progreso: number; // Porcentaje de avance en el curso

  @Field({ defaultValue: false })
  @Prop({ default: false })
  cursoCompletado: boolean;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  createdBy?: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  updatedBy?: Types.ObjectId;

  @Field({ nullable: true })
  @Prop({ default: null })
  deletedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Coleccion.Usuario, default: null })
  deletedBy?: Types.ObjectId;

  @Field(() => DocumentStatus)
  @Prop({
    type: String,
    enum: DocumentStatus,
    default: DocumentStatus.ACTIVE,
  })
  status: DocumentStatus;
}

export const CursoCompradoSchema = SchemaFactory.createForClass(CursoComprado);

CursoCompradoSchema.index({ usuarioId: 1, cursoId: 1 }, { unique: true });
