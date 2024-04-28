// import {
//   IsArray,
//   IsDate,
//   IsEnum,
//   // IsMongoId,
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   IsString,
// } from 'class-validator';
// import { EstadoCuestionario } from '../entities/cuestionario-respuesta-usuario.entity';
// import {
//   Cuestionario,
//   Opciones,
//   Pregunta,
// } from 'src/cuestionario/entities/cuestionario.entity';
// import { PartialType } from '@nestjs/swagger';
// import type { Id } from '../../_common/dtos/id';
// import { Usuario } from 'src/usuarios/entities/usuario.entity';

// export class RespuestaUsuarioDTO {
//   // @IsMongoId()
//   @IsNotEmpty()
//   @IsString()
//   preguntaId: Pregunta['_id'];

//   // @IsArray()
//   // @IsMongoId({ each: true })
//   @IsNotEmpty()
//   respuesta: Opciones['_id'] | Opciones['_id'][];
// }

// export class CreateCuestionarioRespuestaUsuarioDto {
//   // @IsMongoId()
//   @IsString()
//   @IsNotEmpty()
//   _id: Id;

//   // @IsMongoId()
//   @IsString()
//   @IsNotEmpty()
//   usuarioId: Usuario['_id'];

//   @IsString()
//   @IsNotEmpty()
//   cursoId: Usuario['_id'];

//   @IsNumber()
//   @IsNotEmpty()
//   modulo: number;

//   @IsNumber()
//   @IsNotEmpty()
//   unidad: number;

//   // @IsMongoId()
//   @IsNotEmpty()
//   cuestionarioId: Cuestionario['_id'];

//   @IsArray()
//   @IsNotEmpty()
//   respuestas: RespuestaUsuarioDTO[];

//   @IsDate()
//   @IsNotEmpty()
//   fechaRespuesta: Date;

//   @IsNumber()
//   @IsOptional()
//   nota?: number;

//   @IsEnum(EstadoCuestionario)
//   @IsOptional()
//   estado?: EstadoCuestionario;
// }

// export class UpdateCuestionarioRespuestaUsuarioDto extends PartialType(
//   CreateCuestionarioRespuestaUsuarioDto,
// ) {}

import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
import { PartialType } from '@nestjs/swagger';

import { EstadoCuestionario } from '../entities/cuestionario-respuesta-usuario.entity';
// import {
//   Cuestionario,
//   Opciones,
//   Pregunta,
// } from 'src/cuestionario/entities/cuestionario.entity';
// import type { Id } from '../../_common/dtos/id';
// import { Usuario } from 'src/usuarios/entities/usuario.entity';

export class RespuestaUsuarioDTO {
  @IsMongoId()
  @IsNotEmpty()
  preguntaId: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  respuesta: Types.Array<Types.ObjectId>;
}

export class CreateCuestionarioRespuestaUsuarioDto {
  @IsMongoId()
  @IsNotEmpty()
  usuarioId: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  cursoId: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  modulo: number;

  @IsNumber()
  @IsNotEmpty()
  unidad: number;

  @IsMongoId()
  @IsNotEmpty()
  cuestionarioId: Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  respuestas: RespuestaUsuarioDTO[];

  @IsDate()
  @IsNotEmpty()
  fechaRespuesta: Date;

  @IsNumber()
  @IsOptional()
  nota?: number;

  @IsEnum(EstadoCuestionario)
  @IsOptional()
  estado?: EstadoCuestionario;
}

export class UpdateCuestionarioRespuestaUsuarioDto extends PartialType(
  CreateCuestionarioRespuestaUsuarioDto,
) {}
