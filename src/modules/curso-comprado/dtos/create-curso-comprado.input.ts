// curso-comprado/dtos/create-curso-comprado.input.ts

import { InputType, Field, ID, OmitType, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ICursoCompradoInput } from '../interfaces/curso-comprado.interface';
import { Types } from 'mongoose';
import { EstadoAccesoCurso } from 'src/common/enums/estado-acceso-curso.enum';

@InputType()
export class CreateCursoCompradoDto implements ICursoCompradoInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  usuarioId: Types.ObjectId;

  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  cursoId: Types.ObjectId;

  @Field({ nullable: true })
  @IsOptional()
  fechaExpiracion?: Date;

  // Se eliminan los campos de estadoAcceso, progreso y cursoCompletado en CreateCursoCompradoInput para que el usuario no pueda modificarlos

  @Field(() => EstadoAccesoCurso, { nullable: true })
  @IsOptional()
  @IsEnum(EstadoAccesoCurso)
  estadoAcceso?: EstadoAccesoCurso;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  progreso?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  cursoCompletado?: boolean;
}

export class CreateCursoCompradoInput extends OmitType(CreateCursoCompradoDto, [
  'fechaExpiracion',
  'estadoAcceso',
  'progreso',
  'cursoCompletado',
]) {}
