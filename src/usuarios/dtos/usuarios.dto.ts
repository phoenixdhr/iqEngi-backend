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

class PerfilDto {
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

class CursoCompradoDto {
  @IsMongoId()
  readonly cursoId: string;

  @IsDateString()
  readonly fechaCompra: Date;

  @IsDateString()
  readonly fechaExpiracion: Date;

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

  @IsArray()
  @IsEnum(RolUsuario, { each: true })
  @IsOptional()
  readonly rol?: RolUsuario[];

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
  @IsMongoId({ each: true })
  @IsOptional()
  readonly curso_progreso?: string[]; // Utilizamos string[] para simplificar, suponiendo que ProgresoId sea una referencia a un ID de tipo string
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
