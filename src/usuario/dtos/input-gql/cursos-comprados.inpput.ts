import { Field, ID, InputType } from '@nestjs/graphql';
import { CreateCursoCompradoDto } from '../usuario.dto';
import { EstadoAccesoCurso } from 'src/usuario/entities/usuario.entity';

@InputType()
export class CreateCursoCompradoInput extends CreateCursoCompradoDto {
  @Field(() => ID)
  readonly cursoId: string;

  @Field()
  readonly fechaCompra: Date;

  @Field(() => Date)
  readonly fechaExpiracion: Date;

  @Field(() => String)
  readonly estadoAcceso?: EstadoAccesoCurso;

  @Field(() => ID)
  readonly progresoCursoId?: string; // Utilizamos string[] para simplificar, suponiendo que ProgresoId sea una referencia a un ID de tipo string
}
