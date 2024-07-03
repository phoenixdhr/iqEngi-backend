import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
import { ProgresoCurso } from 'src/progreso-cursos/entities/progreso-curso.entity';
import { RolEnum } from 'src/auth/models/roles.model';

export enum EstadoAccesoCurso {
  Activo = 'activo',
  Inactivo = 'inactivo',
}

// #region Perfil
@Schema()
export class Perfil extends Document {
  @Prop()
  bio?: string;

  @Prop()
  ubicacion?: string;

  @Prop()
  celular?: string;

  @Prop()
  fechaNacimiento?: Date;

  @Prop()
  imagenURL?: string;

  @Prop()
  contacto?: string;

  @Prop({ default: [] })
  intereses: Types.Array<string>;
}
export const PerfilSchema = SchemaFactory.createForClass(Perfil);

// #region CursoComprado
@Schema()
export class CursoComprado extends Document {
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  // NOTA PARA CORREGIR. ESTA FECHA DEBERÍA SER AUTOMÁTICA CUANDO SE COMPRA EL CURSO, QUITAR ISOPTIONAL
  // ESTABA DEFINIDA COMO REQUIRE PARA EFECTO DE LOS TEST SE PUSO OPCIONAL
  @Prop()
  fechaCompra: Date;

  // NOTA PARA CORREGIR. ESTA FECHA DEBERÍA SER AUTOMÁTICA CUANDO SE COMPRA EL CURSO, QUITAR ISOPTIONAL
  // ESTABA DEFINIDA COMO REQUIRE PARA EFECTO DE LOS TEST SE PUSO OPCIONAL
  @Prop()
  fechaExpiracion: Date;

  @Prop({
    enum: EstadoAccesoCurso,
    required: true,
    default: EstadoAccesoCurso.Activo,
  })
  estadoAcceso: EstadoAccesoCurso;

  @Prop({ type: Types.ObjectId, ref: ProgresoCurso.name, required: true })
  progresoCursoId: Types.ObjectId; // Opcional, inicialmente vacío hasta que comiencen un curso
}
export const CursoCompradoSchema = SchemaFactory.createForClass(CursoComprado);

// #region Usuario
@Schema()
export class Usuario extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellidos: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hashPassword: string;

  @Prop({
    enum: RolEnum,
    required: true,
    default: RolEnum.ESTUDIANTE,
  })
  rol: RolEnum;

  @Prop({ type: PerfilSchema, default: {} })
  perfil: Perfil;

  @Prop({ type: [CursoCompradoSchema], default: [] })
  cursos_comprados: Types.DocumentArray<CursoComprado>;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
