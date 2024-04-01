import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CuestionarioRespuestaUsuario,
  EstadoCuestionario,
} from '../entities/cuestionario-respuesta-usuario.entity';

@Injectable()
export class CuestionarioRespuestaUsuarioService {
  private cuestionarioRespuestaUsuario: CuestionarioRespuestaUsuario[] = [
    {
      _id: 'cr001',
      usuarioId: 'u001',
      modulo: 1,
      unidad: 2,
      cuestionarioId: 'cq001',
      respuestas: [
        {
          preguntaId: 'pq001',
          respuesta: ['op002'], // Usuario selecciona la opción correcta para la pregunta de opción múltiple
        },
        {
          preguntaId: 'pq002',
          respuesta: [
            'Su importancia radica en garantizar la seguridad y la integridad estructural del tanque, evitando fallas por presión interna o externa.',
          ], // Respuesta abierta
        },
      ],
      fechaRespuesta: new Date('2023-07-01'),
      nota: 10,
      estado: EstadoCuestionario.Aprobado,
    },
    {
      _id: 'cr002',
      usuarioId: 'u002',
      modulo: 2,
      unidad: 1,
      cuestionarioId: 'cq002',
      respuestas: [
        {
          preguntaId: 'pq003',
          respuesta: ['op004'], // Usuario selecciona la opción correcta para la pregunta de verdadero o falso
        },
      ],
      fechaRespuesta: new Date('2023-07-20'),
      nota: 10,
      estado: EstadoCuestionario.Aprobado,
    },
    {
      _id: 'cr003',
      usuarioId: 'u003',
      modulo: 3,
      unidad: 1,
      cuestionarioId: 'cq003',
      respuestas: [
        {
          preguntaId: 'pq004',
          respuesta: ['op006'], // Usuario selecciona la opción correcta para la pregunta de opción múltiple
        },
      ],
      fechaRespuesta: new Date('2023-08-25'),
      nota: 10,
      estado: EstadoCuestionario.Aprobado,
    },
  ];

  findAll() {
    return this.cuestionarioRespuestaUsuario;
  }

  findOne(id: string) {
    const respuesta = this.cuestionarioRespuestaUsuario.find(
      (respuesta) => respuesta._id === id,
    );
    if (!respuesta) {
      throw new NotFoundException(
        `No se encontró ninguna respuesta de cuestionario con el id ${id}`,
      );
    }
    return respuesta;
  }

  create(payload: any) {
    const newRespuesta = {
      _id: `cr${(this.cuestionarioRespuestaUsuario.length + 1).toString().padStart(3, '0')}`, // Genera un ID incremental
      ...payload,
      fechaRespuesta: new Date(), // Asume que la fecha de la respuesta es la actual
      nota: 0, // Nota inicial, podría ajustarse según la lógica de calificación
      estado: EstadoCuestionario.En_progreso, // Estado inicial, podría actualizarse luego de una revisión automática o manual
    };
    this.cuestionarioRespuestaUsuario.push(newRespuesta);
    return newRespuesta;
  }

  update(id: string, payload: any) {
    const index = this.cuestionarioRespuestaUsuario.findIndex(
      (respuesta) => respuesta._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ninguna respuesta de cuestionario con el id ${id} para actualizar`,
      );
    }
    this.cuestionarioRespuestaUsuario[index] = {
      ...this.cuestionarioRespuestaUsuario[index],
      ...payload,
    };
    return this.cuestionarioRespuestaUsuario[index];
  }

  delete(id: string) {
    const index = this.cuestionarioRespuestaUsuario.findIndex(
      (respuesta) => respuesta._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ninguna respuesta de cuestionario con el id ${id} para eliminar`,
      );
    }
    const respuestaEliminada = this.cuestionarioRespuestaUsuario[index];
    this.cuestionarioRespuestaUsuario =
      this.cuestionarioRespuestaUsuario.filter(
        (respuesta) => respuesta._id !== id,
      );
    return respuestaEliminada;
  }
}
