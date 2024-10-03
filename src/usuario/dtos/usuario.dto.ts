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
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { RolEnum } from 'src/auth/enums/roles.model';
import { EstadoAccesoCurso } from '../entities/usuario.entity';
import { UserAuth } from 'src/auth/models/perfil.google';

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

  // NOTA PARA CORREGIR. ESTA FECHA DEBERÍA SER AUTOMÁTICA CUANDO SE COMPRA EL CURSO, QUITAR ISOPTIONAL
  @IsDateString()
  @IsOptional()
  readonly fechaCompra: Date;

  // NOTA PARA CORREGIR. ESTA FECHA DEBERÍA SER AUTOMÁTICA CUANDO SE COMPRA EL CURSO, QUITAR ISOPTIONAL
  @IsDateString()
  @IsOptional()
  readonly fechaExpiracion: Date;

  @IsEnum(EstadoAccesoCurso)
  @IsOptional()
  readonly estadoAcceso?: EstadoAccesoCurso;

  @IsMongoId()
  @IsOptional()
  readonly progresoCursoId?: string; // Utilizamos string[] para simplificar, suponiendo que ProgresoId sea una referencia a un ID de tipo string
}

export class UpdateCursoCompradoDto extends PartialType(
  CreateCursoCompradoDto,
) {}

// #region UsuarioDto
export class CreateUsuarioDto implements UserAuth {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indica si el correo electrónico ha sido verificado',
    default: false,
  })
  readonly email_verified: boolean = false;

  @IsString()
  readonly password: string;

  @ApiProperty({
    description: 'Roles asignados al usuario',
    default: [RolEnum.ESTUDIANTE], // Se establece un valor por defecto
  })
  @IsArray()
  @IsEnum(RolEnum, { each: true })
  readonly roles: RolEnum[] = [RolEnum.ESTUDIANTE]; // Valor por defecto

  @IsUrl()
  @IsOptional()
  picture?: string;

  @ValidateNested()
  @Type(() => CreatePerfilDto)
  @IsOptional()
  readonly perfil?: CreatePerfilDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCursoCompradoDto)
  @IsOptional()
  readonly cursos_comprados?: CreateCursoCompradoDto[];

  @IsBoolean()
  readonly notificaciones?: boolean = true;

  @IsBoolean()
  readonly isActive?: boolean = true;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}

// #region AddCuestionarioDto
export class AddCuestionarioDto {
  @IsMongoId()
  readonly cursoId: string;

  @IsMongoId()
  readonly idEstructuraProgramaria: string;

  @IsMongoId()
  readonly unidadEducativaId: string;
}

export class UserPasswordDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
