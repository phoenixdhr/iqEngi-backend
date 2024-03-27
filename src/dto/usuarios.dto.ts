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
import type { Id } from './id';

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

export class UsuarioDto {
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
  readonly perfil: PerfilDto;

  @IsArray()
  readonly cursos_comprados_historial: CursoCompradoDto[];

  @IsArray()
  readonly curso_progreso_Id: Id[];
}

class CursoCompradoDto {
  @IsString()
  readonly cursoId: Id;

  @IsDate()
  readonly fechaCompra: Date;

  @IsEnum(EstadoAccesoCurso)
  readonly estadoAcceso: EstadoAccesoCurso;
}

class PerfilDto {
  @IsString()
  readonly bio: string;

  @IsString()
  readonly ubicacion: string;

  @IsUrl()
  readonly imagenURL: string;

  @IsString()
  readonly contacto: string;

  @IsArray()
  @IsOptional()
  readonly intereses?: string[];
}
