import {
  IsEmail,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsUrl,
  IsDateString,
  IsMongoId,
  // IsNumberString,
  // IsPhoneNumber,
  IsMobilePhone,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { RolUsuario } from '../entities/usuario.entity';
import { EstadoAccesoCurso } from '../entities/usuario.entity';

// #region PerfilDto
export class CreatePerfilDto {
  @ApiProperty({ description: 'datos del usuario' })
  @IsString()
  @IsOptional()
  readonly bio?: string;

  @IsString()
  @IsOptional()
  readonly ubicacion?: string;

  // @IsNumberString()
  // @IsPhoneNumber()
  @IsMobilePhone()
  @IsOptional()
  readonly celular?: string;

  @IsDateString()
  @IsOptional()
  readonly fechaNacimiento?: Date;

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

export class UpdatePerfilDto extends PartialType(CreatePerfilDto) {}

// #region CursoCompradoDto
export class CreateCursoCompradoDto {
  @IsMongoId()
  readonly cursoId: string;

  @IsDateString()
  readonly fechaCompra: Date;

  @IsDateString()
  readonly fechaExpiracion: Date;

  @IsEnum(EstadoAccesoCurso)
  readonly estadoAcceso: EstadoAccesoCurso;
}

export class UpdateCursoCompradoDto extends PartialType(
  CreateCursoCompradoDto,
) {}

// #region UsuarioDto
export class CreateUsuarioDto {
  @IsString()
  readonly nombre: string;

  @IsString()
  readonly apellidos: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly hashContraseña: string;

  @IsEnum(RolUsuario)
  @IsOptional()
  readonly rol?: RolUsuario;

  @ValidateNested()
  @Type(() => CreatePerfilDto)
  @IsOptional()
  readonly perfil?: CreatePerfilDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCursoCompradoDto)
  @IsOptional()
  readonly cursos_comprados_historial?: CreateCursoCompradoDto[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  readonly curso_progreso?: string[]; // Utilizamos string[] para simplificar, suponiendo que ProgresoId sea una referencia a un ID de tipo string
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
