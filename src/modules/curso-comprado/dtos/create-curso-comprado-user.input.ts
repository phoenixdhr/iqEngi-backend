import { InputType, OmitType } from '@nestjs/graphql';
import { CreateCursoCompradoInput } from './create-curso-comprado.input';

@InputType()
export class CreateCursoComprado_userInput extends OmitType(
  CreateCursoCompradoInput,
  [
    'usuarioId',
    'fechaExpiracion',
    'estadoAcceso',
    'progreso',
    'cursoCompletado',
    'ultimaNota',
  ],
) {}
