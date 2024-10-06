import { registerEnumType } from '@nestjs/graphql';

// Tipo Enumerado para TipoPregunta
export enum TipoPregunta {
  Abierta = 'abierta',
  Alternativa = 'alternativa',
  Opcion_multiple = 'opcion_multiple',
  Verdadero_falso = 'verdadero_falso',
  Ordenamiento = 'ordenamiento',
}

registerEnumType(TipoPregunta, {
  name: 'TipoPregunta',
  description: 'Tipos de preguntas',
});
