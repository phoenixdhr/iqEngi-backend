import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
import { ProgresoCurso } from '../../progreso-cursos/entities/progreso-curso.entity';

export enum RolUsuario {
  Estudiante = 'estudiante',
  Instructor = 'instructor',
  Editor = 'editor',
  Administrador = 'administrador',
}

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

  @Prop({ required: true })
  fechaCompra: Date;

  @Prop({ required: true })
  fechaExpiracion: Date;

  @Prop({ enum: EstadoAccesoCurso, required: true })
  estadoAcceso: EstadoAccesoCurso;
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
  hashContraseña: string;

  @Prop({
    enum: RolUsuario,
    required: true,
    default: RolUsuario.Estudiante,
  })
  rol: RolUsuario;

  @Prop({ type: PerfilSchema, default: {} })
  perfil: Perfil;

  @Prop({ type: [CursoCompradoSchema], default: [] })
  cursos_comprados_historial: Types.Array<CursoComprado>;

  @Prop({ type: [Types.ObjectId], ref: ProgresoCurso.name, default: [] })
  curso_progreso: Types.Array<Types.ObjectId>; // Opcional, inicialmente vacío hasta que comiencen un curso
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
