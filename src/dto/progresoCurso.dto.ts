import { IsArray, IsNumber, IsString } from 'class-validator';

export class ProgresoCursoDto {
  @IsString()
  readonly usuarioId: string;

  @IsString()
  readonly cursoId: string;

  @IsArray()
  readonly modulosCompletados: number[];

  @IsArray()
  readonly examenesEvaluacionesPasadas: boolean[];

  @IsNumber()
  readonly progresoTotal: number;
}
