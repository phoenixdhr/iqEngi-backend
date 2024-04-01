import { Injectable, NotFoundException } from '@nestjs/common';
import { Cuestionario, TipoPregunta } from '../entities/cuestionario.entity';

@Injectable()
export class CuestionarioService {
  private cuestionarios: Cuestionario[] = [
    {
      _id: 'cq001',
      cursoId: '101',
      titulo: 'Evaluación Final sobre Diseño de Tanques según API 650',
      descripcion:
        'Pon a prueba tus conocimientos sobre el diseño de tanques de almacenamiento.',
      preguntas: [
        {
          _id: 'pq001',
          texto: '¿Qué describe mejor el estándar API 650?',
          tipo: TipoPregunta.Opcion_multiple,
          opciones: [
            {
              _id: 'op001',
              texto: 'Diseño de tanques bajo presión',
              esCorrecta: false,
            },
            {
              _id: 'op002',
              texto: 'Diseño de tanques de almacenamiento atmosféricos',
              esCorrecta: true,
            },
            {
              _id: 'op003',
              texto: 'Inspección de soldaduras',
              esCorrecta: false,
            },
          ],
          respuestaCorrecta: 'op002',
        },
        {
          _id: 'pq002',
          texto:
            '¿Cuál es la importancia de los cálculos de espesor en el diseño de un tanque según API 650?',
          tipo: TipoPregunta.Abierta,
          opciones: [],
        },
      ],
      fecha: new Date('2023-06-30'),
    },
    {
      _id: 'cq002',
      cursoId: '102',
      titulo: 'Cuestionario sobre Diseño de Recipientes a Presión ASME VIII',
      descripcion:
        'Evalúa tus conocimientos en el diseño conforme al código ASME Sección VIII.',
      preguntas: [
        {
          _id: 'pq003',
          texto:
            '¿Qué sección del código ASME cubre el diseño de recipientes a presión?',
          tipo: TipoPregunta.Verdadero_falso,
          opciones: [
            { _id: 'op004', texto: 'Sección VIII', esCorrecta: true },
            { _id: 'op005', texto: 'Sección IX', esCorrecta: false },
          ],
          respuestaCorrecta: 'op004',
        },
      ],
      fecha: new Date('2023-07-15'),
    },
    {
      _id: 'cq003',
      cursoId: '103',
      titulo:
        'Examen sobre Inspección y Reparación de Sistemas de Tuberías API 570',
      descripcion:
        'Verifica tus habilidades en inspección y reparación de sistemas de tuberías.',
      preguntas: [
        {
          _id: 'pq004',
          texto: '¿API 570 aplica para qué tipo de sistemas de tuberías?',
          tipo: TipoPregunta.Opcion_multiple,
          opciones: [
            {
              _id: 'op006',
              texto: 'Sistemas de tuberías de proceso',
              esCorrecta: true,
            },
            {
              _id: 'op007',
              texto: 'Sistemas de tuberías de transmisión de gas',
              esCorrecta: false,
            },
            {
              _id: 'op008',
              texto: 'Sistemas de drenaje subterráneo',
              esCorrecta: false,
            },
          ],
          respuestaCorrecta: 'op006',
        },
      ],
      fecha: new Date('2023-08-20'),
    },
  ];

  findAll() {
    return this.cuestionarios;
  }

  findOne(id: string) {
    const cuestionario = this.cuestionarios.find(
      (cuestionario) => cuestionario._id === id,
    );
    if (!cuestionario) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id}`,
      );
    }
    return cuestionario;
  }

  create(payload: any) {
    const newCuestionario = {
      _id: `cq${(this.cuestionarios.length + 1).toString().padStart(3, '0')}`, // Genera un ID incremental
      ...payload,
      fecha: new Date(), // Asume que la fecha del cuestionario es la actual
    };
    this.cuestionarios.push(newCuestionario);
    return newCuestionario;
  }

  update(id: string, payload: any) {
    const index = this.cuestionarios.findIndex(
      (cuestionario) => cuestionario._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id} para actualizar`,
      );
    }
    this.cuestionarios[index] = { ...this.cuestionarios[index], ...payload };
    return this.cuestionarios[index];
  }

  delete(id: string) {
    const index = this.cuestionarios.findIndex(
      (cuestionario) => cuestionario._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id} para eliminar`,
      );
    }
    const cuestionarioEliminado = this.cuestionarios[index];
    this.cuestionarios = this.cuestionarios.filter(
      (cuestionario) => cuestionario._id !== id,
    );
    return cuestionarioEliminado;
  }
}
