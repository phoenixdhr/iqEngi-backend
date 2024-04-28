import {
  IsEmail,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  // IsOptional,
  // IsDate,
  IsOptional,
  IsUrl,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

enum RolUsuario {
  Estudiante = 'estudiante',
  Instructor = 'instructor',
  Editor = 'editor',
  Administrador = 'administrador',
}

enum EstadoAccesoCurso {
  Activo = 'activo',
  Inactivo = 'inactivo',
}

class PerfilDto {
  @ApiProperty({ description: 'datos del usuario' })
  @IsString()
  @IsOptional()
  readonly bio?: string;

  @IsString()
  @IsOptional()
  readonly ubicacion?: string;

  @IsUrl()
  @IsOptional()
  readonly imagenURL?: string;

  @IsString()
  @IsOptional()
  readonly contacto?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly intereses?: string[];
}

class CursoCompradoDto {
  @IsMongoId()
  readonly cursoId: Types.ObjectId;

  @IsDateString()
  readonly fechaCompra: Date;

  @IsEnum(EstadoAccesoCurso)
  readonly estadoAcceso: EstadoAccesoCurso;
}

export class CreateUsuarioDto {
  @IsString()
  readonly nombre: string;

  @IsString()
  readonly apellidos: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly hashContraseña: string;

  @IsEnum(RolUsuario, { each: true })
  readonly rol: RolUsuario[];

  @ValidateNested()
  @Type(() => PerfilDto)
  @IsOptional()
  readonly perfil?: PerfilDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CursoCompradoDto)
  @IsOptional()
  readonly cursos_comprados_historial?: CursoCompradoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Types.ObjectId)
  readonly curso_progreso?: Types.ObjectId[]; // Utilizamos string[] para simplificar, suponiendo que ProgresoId sea una referencia a un ID de tipo string
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
