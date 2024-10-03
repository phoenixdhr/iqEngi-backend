import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Curso } from '../../curso/entities/curso.entity';
import { ProgresoCurso } from 'src/progreso-curso/entities/progreso-curso.entity';
import { RolEnum } from 'src/auth/enums/roles.model';
import { UserAuth } from 'src/auth/models/perfil.google';
import { ObjectType, Field, ID } from '@nestjs/graphql';
// importa omitType de @nestjs/graphql
import { OmitType } from '@nestjs/graphql';

export enum EstadoAccesoCurso {
  Activo = 'activo',
  Inactivo = 'inactivo',
}

// #region Perfil
@ObjectType()
@Schema()
export class Perfil extends Document {
  @Field()
  @Prop()
  bio?: string;

  @Field()
  @Prop()
  ubicacion?: string;

  @Field()
  @Prop()
  celular?: string;

  @Field()
  @Prop()
  fechaNacimiento?: Date;

  @Field()
  @Prop()
  contacto?: string;

  @Field(() => [String])
  @Prop({ default: [] })
  intereses: Types.Array<string>;
}
export const PerfilSchema = SchemaFactory.createForClass(Perfil);

// #region CursoComprado
@Schema()
@ObjectType()
export class CursoComprado extends Document {
  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
  cursoId: Types.ObjectId;

  // NOTA PARA CORREGIR. ESTA FECHA DEBERÍA SER AUTOMÁTICA CUANDO SE COMPRA EL CURSO, QUITAR ISOPTIONAL
  // ESTABA DEFINIDA COMO REQUIRE PARA EFECTO DE LOS TEST SE PUSO OPCIONAL
  @Field()
  @Prop()
  fechaCompra: Date;

  // NOTA PARA CORREGIR. ESTA FECHA DEBERÍA SER AUTOMÁTICA CUANDO SE COMPRA EL CURSO, QUITAR ISOPTIONAL
  // ESTABA DEFINIDA COMO REQUIRE PARA EFECTO DE LOS TEST SE PUSO OPCIONAL
  @Field()
  @Prop()
  fechaExpiracion: Date;

  @Field(() => String) // REVISAR si debe ser "EstadoAccesoCurso" o "String" o crearse un typo o enum especial para GRAPHQL
  @Prop({
    enum: EstadoAccesoCurso,
    required: true,
    default: EstadoAccesoCurso.Activo,
  })
  estadoAcceso: EstadoAccesoCurso;

  @Field(() => String)
  @Prop({ type: Types.ObjectId, ref: ProgresoCurso.name, required: true })
  progresoCursoId: Types.ObjectId; // Opcional, inicialmente vacío hasta que comiencen un curso
}
export const CursoCompradoSchema = SchemaFactory.createForClass(CursoComprado);

// #region Usuario
@Schema()
@ObjectType()
export class Usuario extends Document implements UserAuth {
  @Field(() => ID)
  // @Prop({ required: true })
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop()
  email_verified: boolean = false;

  @Field()
  @Prop({ required: true })
  hashPassword?: string;

  @Field(() => [RolEnum])
  @Prop({
    type: [String], // El campo roles es un array de strings
    enum: Object.values(RolEnum), // Se usa Object.values para pasar los valores del enum
    required: true,
  })
  roles: RolEnum[];

  @Field(() => [String], { nullable: true })
  @Prop()
  picture?: string;

  @Field(() => Perfil)
  @Prop({ type: PerfilSchema, default: {} })
  perfil: Perfil;

  @Field(() => [CursoComprado])
  @Prop({ type: [CursoCompradoSchema], default: [] })
  cursos_comprados: Types.DocumentArray<CursoComprado>;

  @Field()
  @Prop({ default: true })
  notificaciones: boolean;

  @Field()
  @Prop({ default: true })
  isActive: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

@ObjectType()
export class UsuarioType extends OmitType(Usuario, ['hashPassword'] as const) {}
