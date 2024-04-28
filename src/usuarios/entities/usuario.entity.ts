import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../cursos/entities/curso.entity';
import { ProgresoCurso } from '../../progreso-cursos/entities/progreso-curso.entity';
// type id = string; // Cambiado a string para reflejar el uso de MongoDB ObjectId.

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

@Schema()
export class Perfil extends Document {
  @Prop()
  bio?: string;

  @Prop()
  ubicacion?: string;

  @Prop()
  imagenURL?: string;

  @Prop()
  contacto?: string;

  @Prop()
  intereses?: string[];
}
export const PerfilSchema = SchemaFactory.createForClass(Perfil);

@Schema()
export class CursoComprado extends Document {
  @Prop({ type: Types.ObjectId, ref: Curso.name })
  cursoId: Types.ObjectId;

  @Prop()
  fechaCompra: Date;

  @Prop({ enum: EstadoAccesoCurso })
  estadoAcceso: EstadoAccesoCurso;
}
export const CursoCompradoSchema = SchemaFactory.createForClass(CursoComprado);

//ENTIDAD
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

  @Prop({ enum: RolUsuario, required: true })
  rol: RolUsuario[];

  @Prop({ type: PerfilSchema, default: null })
  perfil?: Perfil;

  @Prop({ type: [CursoCompradoSchema], default: [] })
  cursos_comprados_historial?: CursoComprado[];

  @Prop({ type: [Types.ObjectId], ref: ProgresoCurso.name, default: [] })
  curso_progreso?: Types.Array<Types.ObjectId>; // Opcional, inicialmente vacío hasta que comiencen un curso
}
