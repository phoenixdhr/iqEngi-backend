import {
  IsEmail,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  // IsOptional,
  IsDate,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { Id } from '../../common/dtos/id';
import { PartialType } from '@nestjs/mapped-types';
import { Curso, ProgresoCurso } from 'eliminame';

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

export class CreateUsuarioDto {
  @IsString()
  readonly _id: Id;

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
  @IsString({ each: true })
  @IsOptional()
  readonly curso_progreso?: ProgresoId[]; // Utilizamos string[] para simplificar, suponiendo que ProgresoId sea una referencia a un ID de tipo string
}

class ProgresoId {
  @IsString()
  progresoCursoId: ProgresoCurso['_id'];

  @IsString()
  cursoId: Curso['_id'];
}

class CursoCompradoDto {
  @IsString()
  readonly cursoId: Id;

  @IsDate()
  readonly fechaCompra: Date;

  @IsEnum(EstadoAccesoCurso)
  readonly estadoAcceso: EstadoAccesoCurso;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
