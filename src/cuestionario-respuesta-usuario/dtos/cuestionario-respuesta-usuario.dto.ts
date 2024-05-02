import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  // IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { EstadoCuestionario } from '../entities/cuestionario-respuesta-usuario.entity';
import { Type } from 'class-transformer';

// #region RespuestaUsuarioDTO
export class CreateRespuestaUsuarioDTO {
  @IsMongoId()
  preguntaId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @ArrayNotEmpty()
  respuesta: string[];
}

export class UpdateRespuestaUsuarioDTO extends PartialType(
  CreateRespuestaUsuarioDTO,
) {}

// #region CuestionarioRespuestaDto
export class CreateCuestionarioRespuestaUsuarioDto {
  @IsMongoId()
  usuarioId: string;

  @IsMongoId()
  @IsOptional()
  cursoId?: string; // sera extraido de Cuestionario usando CuestionarioId

  @IsMongoId()
  @IsOptional()
  unidadEducativaId?: string; // sera extraido de Cuestionario usando CuestionarioId

  @IsMongoId()
  cuestionarioId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRespuestaUsuarioDTO)
  @IsOptional()
  respuestas?: CreateRespuestaUsuarioDTO[];

  @IsDate()
  @IsOptional()
  fechaRespuesta?: Date;

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
