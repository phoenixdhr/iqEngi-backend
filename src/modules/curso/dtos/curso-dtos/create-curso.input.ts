import { InputType, Field, Float, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  IsArray,
  IsMongoId,
  IsUrl,
  Max,
  IsDate,
  IsCurrency,
} from 'class-validator';
import { Nivel } from 'src/common/enums/nivel.enum'; // Enum para niveles
import { ICursoInput } from '../../interfaces/curso.interface';
import { Types } from 'mongoose';
import { Modulo } from '../../entities/modulo.entity';

@InputType()
export class CreateCursoInput implements ICursoInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  courseTitle: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  descripcionCorta: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcionLarga?: string;

  @Field(() => Nivel, { nullable: true })
  @IsOptional()
  @IsEnum(Nivel)
  nivel?: Nivel;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  instructor?: Types.ObjectId;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duracionHoras?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  imagenURL?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  precio?: number;

  @Field({ nullable: true })
  @IsString()
  @IsCurrency()
  @IsOptional()
  currency?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  descuento?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aprenderas?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  objetivos?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dirigidoA?: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  modulos?: Modulo[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  fechaLanzamiento?: Date;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categorias?: Types.ObjectId[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  cuestionarioId?: Types.ObjectId;
}
