import { registerEnumType } from '@nestjs/graphql';

// Tipo Enumerado para TipoPregunta
export enum TipoPregunta {
  ABIERTA = 'abierta',
  ALTERNATIVA = 'alternativa',
  OPCION_MULTIPLE = 'opcion_multiple', // INCLUYE VERDADERO O FALSO
  ORDENAMIENTO = 'ordenamiento',
}

registerEnumType(TipoPregunta, {
  name: 'TipoPregunta',
  description: 'Tipos de preguntas',
});
