import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { Curso } from 'src/cursos/entities/curso.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CuestionarioRespuestaUsuario } from 'src/cuestionario-respuesta-usuario/entities/cuestionario-respuesta-usuario.entity';

export class CreateProgresoCursoDto {
  @IsNotEmpty()
  cursoId: Curso['_id']; // Utilizamos un DTO para el ID para asegurar su validación

  @IsNotEmpty()
  usuarioId: Usuario['_id']; // Igual que para el cursoId

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CuestionarioRespuestaUsuario['_id'])
  evaluacionUsuario?: CuestionarioRespuestaUsuario['_id'][]; // Opcional. Se valida que, si se proporciona, sea un array de ID válidos

  @IsNumber()
  @IsNotEmpty()
  progresoTotal: number; // Se valida que sea un número y que no esté vacío
}

export class UpdateProgresoCursoDto extends PartialType(
  CreateProgresoCursoDto,
) {}
