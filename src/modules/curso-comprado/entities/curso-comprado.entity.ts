import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EstadoAccesoCurso } from 'src/common/enums/estado-acceso-curso.enum';
import { Curso } from 'src/modules/curso/entities/curso.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { ICursoComprado } from '../interfaces/curso-comprado.interface';

import { AuditFields } from 'src/common/clases/audit-fields.class';
import { addSoftDeleteMiddleware } from 'src/common/middlewares/soft-delete.middleware';

// #region CursoComprado
@Schema({ timestamps: true }) // Mantiene los timestamps para createdAt y updatedAt
@ObjectType()
export class CursoComprado extends AuditFields implements ICursoComprado {
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
}

export const CursoCompradoSchema = SchemaFactory.createForClass(CursoComprado);

CursoCompradoSchema.index({ usuarioId: 1, cursoId: 1 }, { unique: true });

CursoCompradoSchema.index({ deleted: 1 });

addSoftDeleteMiddleware<CursoComprado, CursoComprado>(CursoCompradoSchema);
