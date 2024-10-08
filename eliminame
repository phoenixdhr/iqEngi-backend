
// //#region calificacion

// // calificacion.entity.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import { Usuario } from '../../usuario/entities/usuario.entity';
// import { Curso } from '../../curso/entities/curso.entity';
// import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

// @ObjectType()
// @Schema()
// export class Calificacion extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => Usuario)
//   @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
//   usuarioId: Types.ObjectId;

//   @Field(() => Curso)
//   @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
//   cursoId: Types.ObjectId;

//   @Field(() => Int)
//   @Prop({ required: true, min: 1, max: 5 })
//   valor: number;

//   @Field({ nullable: true })
//   @Prop()
//   comentario?: string;

//   @Field()
//   @Prop({ default: Date.now })
//   fecha: Date;
// }

// export const CalificacionSchema = SchemaFactory.createForClass(Calificacion);

// CalificacionSchema.index({ usuarioId: 1, cursoId: 1 }, { unique: true });




// _________________________

// //#region categoria

// import { Field, ID, ObjectType } from '@nestjs/graphql';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @ObjectType()
// @Schema()
// export class Categoria extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field()
//   @Prop({ required: true, unique: true })
//   nombre: string;

//   @Field({ nullable: true })
//   @Prop()
//   descripcion?: string;
// }

// export const CategoriaSchema = SchemaFactory.createForClass(Categoria);


// _________________________

// //#region comentario

// // comentario.entity.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import { Usuario } from '../../usuario/entities/usuario.entity';
// import { Curso } from '../../curso/entities/curso.entity';
// import { ObjectType, Field, ID } from '@nestjs/graphql';

// @ObjectType()
// @Schema()
// export class Comentario extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => Usuario)
//   @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
//   usuarioId: Types.ObjectId;

//   @Field(() => Curso)
//   @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
//   cursoId: Types.ObjectId;

//   @Field()
//   @Prop({ required: true })
//   comentario: string;

//   @Field()
//   @Prop({ default: Date.now })
//   fecha: Date;
// }

// export const ComentarioSchema = SchemaFactory.createForClass(Comentario);

// ComentarioSchema.index({ cursoId: 1 });

// _________________________

// //#region cuesitonario

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

// import { Pregunta, PreguntaSchema } from './pregunta.entity';
// import { Curso } from 'src/curso/entities/curso.entity';

// @ObjectType()
// @Schema()
// export class Cuestionario extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => Curso)
//   @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
//   cursoId: Types.ObjectId;

//   @Field()
//   @Prop({ required: true })
//   titulo: string;

//   @Field({ nullable: true })
//   @Prop()
//   descripcion?: string;

//   @Field(() => [Pregunta])
//   @Prop({ type: [PreguntaSchema], default: [] })
//   preguntas: Pregunta[];

//   @Field(() => Int, { nullable: true })
//   @Prop()
//   numeroPreguntasPresentar?: number;

//   @Field()
//   @Prop({ default: Date.now })
//   fechaCreacion: Date;
// }
// export const CuestionarioSchema = SchemaFactory.createForClass(Cuestionario);

// CuestionarioSchema.index({ cursoId: 1 }, { unique: true });


// _________________________


// //#region opcion
// import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { IOpcion } from '../interfaces/opcion.interface';

// // #region Opcion
// @ObjectType()
// @Schema()
// export class Opcion extends Document implements IOpcion {
//   @Field(() => ID)
//   _id: string;

//   @Field()
//   @Prop({ required: true })
//   textOpcion: string;

//   @Field()
//   @Prop({ required: true })
//   esCorrecta: boolean;

//   @Field(() => Int, { nullable: true })
//   @Prop()
//   orden?: number;
// }

// export const OpcionSchema = SchemaFactory.createForClass(Opcion);


// _________________________


// // #region Pregunta
// import { Field, ID, ObjectType } from '@nestjs/graphql';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { TipoPregunta } from 'src/common/enums/tipo-pregunta.enum';
// import { Opcion, OpcionSchema } from './opcion.entity';
// import { Types } from 'mongoose';
// import { Modulo } from 'src/modules/curso/entities/modulo.entity';
// import { Unidad } from 'src/modules/curso/entities/unidad.entity';
// import { IPregunta } from '../interfaces/pregunta.interface';

// // #region Pregunta
// @ObjectType()
// @Schema()
// export class Pregunta extends Document implements IPregunta {
//   @Field(() => ID)
//   _id: string;

//   @Field()
//   @Prop({ required: true })
//   enunciado: string;

//   @Field(() => TipoPregunta)
//   @Prop({ required: true, enum: TipoPregunta })
//   tipoPregunta: TipoPregunta;

//   @Field(() => [Opcion], { nullable: true })
//   @Prop({ type: [OpcionSchema], default: [] })
//   opciones?: Opcion[];

//   @Field(() => Modulo, { nullable: true })
//   @Prop({ type: Types.ObjectId, ref: Modulo.name })
//   moduloId?: Types.ObjectId;

//   @Field(() => Unidad, { nullable: true })
//   @Prop({ type: Types.ObjectId, ref: Unidad.name })
//   unidadId?: Types.ObjectId;
// }

// export const PreguntaSchema = SchemaFactory.createForClass(Pregunta);


// _________________________

// // #region Curso
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// import { Categoria } from '../../categoria/entities/categoria.entity';
// import { Instructor } from '../../instructor/entities/instructor.entity';
// import { ICurso } from '../interfaces/curso.interfaz';
// import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
// import { Modulo } from './modulo.entity';
// import { Cuestionario } from 'src/modules/cuestionario/entities/cuestionario.entity';
// import { Nivel } from 'src/common/enums/nivel.enum';


// @ObjectType()
// @Schema()
// export class Curso extends Document implements ICurso {
//   @Field(() => ID)
//   _id: string;

//   @Field()
//   @Prop({ required: true })
//   titulo: string;

//   @Field()
//   @Prop({ required: true })
//   descripcionCorta: string;

//   @Field({ nullable: true })
//   @Prop()
//   descripcionLarga?: string;

//   @Field(() => Nivel, { nullable: true })
//   @Prop({ enum: Nivel })
//   nivel?: Nivel;

//   @Field(() => Instructor, { nullable: true })
//   @Prop({ type: Types.ObjectId, ref: Instructor.name })
//   instructor?: Types.ObjectId;

//   @Field(() => Float, { nullable: true })
//   @Prop()
//   duracionHoras?: number;

//   @Field({ nullable: true })
//   @Prop()
//   imagenURL?: string;

//   @Field(() => Float)
//   @Prop({ required: true })
//   precio: number;

//   @Field(() => Float, { nullable: true })
//   @Prop({ default: 0 })
//   descuento?: number;

//   @Field(() => Float)
//   @Prop({ default: 0 })
//   calificacionPromedio: number;

//   @Field(() => Int)
//   @Prop({ default: 0 })
//   numeroCalificaciones: number;

//   @Field(() => [String])
//   @Prop({ default: [] })
//   aprenderas: string[];

//   @Field(() => [String])
//   @Prop({ default: [] })
//   objetivos: string[];

//   @Field(() => [String])
//   @Prop({ default: [] })
//   dirigidoA: string[];

//   @Field(() => [Modulo])
//   @Prop({ type: [Types.ObjectId], ref: Modulo.name, default: [] })
//   modulos: Types.ObjectId[];

//   @Field({ nullable: true })
//   @Prop()
//   fechaLanzamiento?: Date;

//   @Field(() => [Categoria])
//   @Prop({ type: [Types.ObjectId], ref: Categoria.name, default: [] })
//   categorias: Types.ObjectId[];

//   @Field(() => Cuestionario, { nullable: true })
//   @Prop({ type: Types.ObjectId, ref: Cuestionario.name })
//   cuestionarioId?: Types.ObjectId;
// }

// export const CursoSchema = SchemaFactory.createForClass(Curso);

// CursoSchema.index({ titulo: 'text' });
// CursoSchema.index({ categorias: 1, cuestionarioId: 1 });


// _________________________

// //#region  material

// // material.entity.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ObjectType, Field } from '@nestjs/graphql';

// @ObjectType()
// @Schema()
// export class Material {
//   @Field()
//   @Prop({ required: true })
//   titulo: string;

//   @Field({ nullable: true })
//   @Prop()
//   descripcion?: string;

//   @Field()
//   @Prop({ required: true })
//   url: string;
// }

// export const MaterialSchema = SchemaFactory.createForClass(Material);

// _________________________

// //#region modulo

// // modulo.entity.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import { Curso } from './curso.entity';
// import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
// import { Unidad } from './unidad.entity';

// @ObjectType()
// @Schema()
// export class Modulo extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => Curso)
//   @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
//   cursoId: Types.ObjectId;

//   @Field(() => Int)
//   @Prop({ required: true })
//   numeroModulo: number;

//   @Field()
//   @Prop({ required: true })
//   titulo: string;

//   @Field({ nullable: true })
//   @Prop()
//   descripcion?: string;

//   @Field(() => [Unidad])
//   @Prop({ type: [Types.ObjectId], ref: Unidad.name, default: [] })
//   unidades: Types.ObjectId[];
// }

// export const ModuloSchema = SchemaFactory.createForClass(Modulo);

// ModuloSchema.index({ cursoId: 1, numeroModulo: 1 }, { unique: true });


// _________________________


// //#region  unidad
// // unidad-educativa.entity.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';
// import { Modulo } from './modulo.entity';
// import { Material, MaterialSchema } from './material.entity';
// import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

// @ObjectType()
// @Schema()
// export class Unidad extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => Modulo)
//   @Prop({ type: Types.ObjectId, ref: Modulo.name, required: true })
//   moduloId: Types.ObjectId;

//   @Field(() => Int)
//   @Prop({ required: true })
//   numeroUnidad: number;

//   @Field()
//   @Prop({ required: true })
//   titulo: string;

//   @Field({ nullable: true })
//   @Prop()
//   descripcion?: string;

//   @Field({ nullable: true })
//   @Prop()
//   urlVideo?: string;

//   @Field(() => [Material], { nullable: true })
//   @Prop({ type: [MaterialSchema], default: [] })
//   materiales?: Material[];
// }

// export const UnidadSchema = SchemaFactory.createForClass(Unidad);

// UnidadSchema.index({ moduloId: 1, numeroUnidad: 1 }, { unique: true });


// _________________________


// // #region CursoComprado

// import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
// import { EstadoAccesoCurso } from 'src/common/enums/estado-acceso-curso.enum';
// import { Curso } from 'src/modules/curso/entities/curso.entity';
// import { Usuario } from 'src/modules/usuario/entities/usuario.entity';

// @Schema()
// @ObjectType()
// export class CursoComprado extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => Usuario)
//   @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
//   usuarioId: Types.ObjectId;

//   @Field(() => Curso)
//   @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
//   cursoId: Types.ObjectId;

//   @Field()
//   @Prop({ required: true, default: Date.now })
//   fechaCompra: Date;

//   @Field({ nullable: true })
//   @Prop()
//   fechaExpiracion?: Date;

//   @Field(() => EstadoAccesoCurso)
//   @Prop({ enum: EstadoAccesoCurso, default: EstadoAccesoCurso.Activo })
//   estadoAcceso: EstadoAccesoCurso;

//   @Field(() => Float, { defaultValue: 0 })
//   @Prop({ default: 0 })
//   progreso: number; // Porcentaje de avance en el curso

//   @Field({ defaultValue: false })
//   @Prop({ default: false })
//   cursoCompletado: boolean;
// }

// export const CursoCompradoSchema = SchemaFactory.createForClass(CursoComprado);

// CursoCompradoSchema.index({ usuarioId: 1, cursoId: 1 }, { unique: true });


// _________________________

// // #region Instructores

// import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @ObjectType()
// @Schema()
// export class Instructor extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field()
//   @Prop({ required: true })
//   firstName: string;

//   @Field()
//   @Prop({ required: true })
//   lastName: string;

//   @Field({ nullable: true })
//   @Prop()
//   profesion?: string;

//   @Field(() => [String])
//   @Prop({ default: [] })
//   especializacion: string[];

//   @Field(() => Float)
//   @Prop({ default: 0 })
//   calificacionPromedio: number;

//   @Field({ nullable: true })
//   @Prop()
//   pais?: string;
// }

// export const InstructorSchema = SchemaFactory.createForClass(Instructor);


// _________________________

// //#region  orden
// // orden.entity.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
// import { Document, Types } from 'mongoose';

// import { Usuario } from '../../usuario/entities/usuario.entity';
// import { Curso } from '../../curso/entities/curso.entity';
// import { EstadoOrden } from '../../../common/enums/estado-orden.enum';

// @ObjectType()
// @Schema()
// export class Orden extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => Usuario)
//   @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
//   usuarioId: Types.ObjectId;

//   @Field(() => [Curso])
//   @Prop({
//     type: [
//       {
//         cursoId: { type: Types.ObjectId, ref: Curso.name },
//         precio: { type: Number, required: true },
//       },
//     ],
//     required: true,
//   })
//   cursos: Array<{ cursoId: Types.ObjectId; precio: number }>;

//   @Field()
//   @Prop({ required: true, default: Date.now })
//   fechaCreacion: Date;

//   @Field({ nullable: true })
//   @Prop()
//   fechaActualizacion?: Date;

//   @Field(() => Float)
//   @Prop({ required: true })
//   montoTotal: number;

//   @Field(() => EstadoOrden)
//   @Prop({ enum: EstadoOrden, default: EstadoOrden.Pendiente })
//   estado: EstadoOrden;
// }

// export const OrdenSchema = SchemaFactory.createForClass(Orden);

// OrdenSchema.pre('save', function (next) {
//   this.montoTotal = this.cursos.reduce((acc, curso) => acc + curso.precio, 0);
//   this.fechaActualizacion = new Date();
//   next();
// });

// OrdenSchema.index({ usuarioId: 1 });

// _________________________
// // #region RespuestaCuestionario

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// import { Curso } from '../../curso/entities/curso.entity';
// import { Cuestionario } from '../../cuestionario/entities/cuestionario.entity';

// import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
// import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
// import {
//   RespuestaPregunta,
//   RespuestaPreguntaUsuarioSchema,
// } from './respuesta-pregunta.entity';
// import { EstadoCuestionario } from 'src/common/enums/estado-cuestionario.enum';

// // 'RespuestaUsuario' captura las respuestas dadas por un usuario a un cuestionario específico.
// @Schema()
// @ObjectType()
// export class RespuestaCuestionario extends Document {
//   @Field(() => ID)
//   _id: string;

//   @Field(() => Usuario)
//   @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
//   usuarioId: Types.ObjectId;

//   @Field(() => Curso)
//   @Prop({ type: Types.ObjectId, ref: Curso.name, required: true })
//   cursoId: Types.ObjectId; // sera extraido de Cuestionario usando CuestionarioId, y se agregara al DTo correspondiente antes de ser guardado.

//   @Field(() => Cuestionario)
//   @Prop({ type: Types.ObjectId, ref: Cuestionario.name, required: true })
//   cuestionarioId: Types.ObjectId;

//   @Field(() => [RespuestaPregunta])
//   @Prop({ type: [RespuestaPreguntaUsuarioSchema], required: true })
//   respuestas: RespuestaPregunta[];

//   @Field()
//   @Prop({ default: Date.now })
//   fecha: Date;

//   @Field(() => Float, { nullable: true })
//   @Prop()
//   nota?: number;

//   @Field()
//   @Prop({ enum: EstadoCuestionario, required: true })
//   estado: string;
// }

// export const RespuestaCuestionarioUsuarioSchema = SchemaFactory.createForClass(
//   RespuestaCuestionario,
// );

// RespuestaCuestionarioUsuarioSchema.index(
//   { usuarioId: 1, cursoId: 1, cuestionarioId: 1 },
//   { unique: true },
// );



// _________________________

// // #region RespuestaPregunta


// import { Field, ObjectType } from '@nestjs/graphql';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
// import { Opcion } from 'src/modules/cuestionario/entities/opcion.entity';
// import { Pregunta } from 'src/modules/cuestionario/entities/pregunta.entity';


// // 'Respuesta' detalla la respuesta dada por un usuario a una pregunta específica dentro de un cuestionario.
// @ObjectType()
// @Schema()
// export class RespuestaPregunta extends Document {
//   @Field(() => Pregunta)
//   @Prop({ type: Types.ObjectId, ref: Pregunta.name, required: true })
//   preguntaId: Types.ObjectId;

//   @Field(() => [Opcion], { nullable: true })
//   @Prop({ type: [Types.ObjectId], ref: Opcion.name })
//   opcionIds?: Types.ObjectId[];

//   @Field({ nullable: true })
//   @Prop()
//   respuestaAbierta?: string;
// }

// export const RespuestaPreguntaUsuarioSchema =
//   SchemaFactory.createForClass(RespuestaPregunta);


//   _________________________
//   // #region Usuario

//   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//   import { Document } from 'mongoose';

//   import { RolEnum } from 'src/modules/auth/enums-graphql/roles.model';
//   import { UserAuth } from 'src/modules/auth/interfaces/google-perfil.interface';
//   import { ObjectType, Field, ID } from '@nestjs/graphql';
//   import { Perfil, PerfilSchema } from './perfil.entity';

//   @ObjectType()
//   @Schema()
//   export class Usuario extends Document implements UserAuth {
//     @Field(() => ID)
//     _id: string;

//     @Field()
//     @Prop({ required: true })
//     firstName: string;

//     @Field()
//     @Prop({ required: true })
//     lastName: string;

//     @Field()
//     @Prop({ required: true, unique: true })
//     email: string;

//     @Field()
//     @Prop({ default: false })
//     email_verified: boolean;

//     @Prop({ required: true })
//     hashPassword?: string;

//     @Field(() => [RolEnum])
//     @Prop({
//       type: [String],
//       enum: RolEnum,
//       required: true,
//     })
//     roles: RolEnum[];

//     @Field({ nullable: true })
//     @Prop()
//     picture?: string;

//     @Field(() => Perfil, { nullable: true })
//     @Prop({ type: PerfilSchema })
//     perfil?: Perfil;

//     @Field()
//     @Prop({ default: true })
//     notificaciones: boolean;

//     @Field()
//     @Prop({ default: true })
//     isActive: boolean;
//   }

//   export const UsuarioSchema = SchemaFactory.createForClass(Usuario);



//   _________________________
//   // #region Perfil


//   import { Field, ObjectType } from '@nestjs/graphql';
//   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//   @ObjectType()
//   @Schema()
//   export class Perfil extends Document {
//     @Field({ nullable: true })
//     @Prop()
//     bio?: string;

//     @Field({ nullable: true })
//     @Prop()
//     ubicacion?: string;

//     @Field({ nullable: true })
//     @Prop()
//     celular?: string;

//     @Field({ nullable: true })
//     @Prop()
//     fechaNacimiento?: Date;

//     @Field({ nullable: true })
//     @Prop()
//     contacto?: string;

//     @Field(() => [String], { nullable: true })
//     @Prop({ type: [String], default: [] })
//     intereses?: string[];
//   }
//   export const PerfilSchema = SchemaFactory.createForClass(Perfil);

