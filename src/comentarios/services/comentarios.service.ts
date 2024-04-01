import { Injectable, NotFoundException } from '@nestjs/common';
import { Comentario } from '../entities/comentario.entity';

@Injectable()
export class ComentariosService {
  private comentarios: Comentario[] = [
    {
      _id: 'c001',
      cursoId: '101',
      usuarioId: 'u001',
      comentario:
        'Este curso superó mis expectativas. Excelente contenido y profundidad.',
      calificacion: 5,
      fecha: new Date('2023-06-25'),
    },
    {
      _id: 'c002',
      cursoId: '102',
      usuarioId: 'u002',
      comentario: 'Muy informativo, pero esperaba más ejercicios prácticos.',
      calificacion: 4,
      fecha: new Date('2023-07-10'),
    },
    {
      _id: 'c003',
      cursoId: '103',
      usuarioId: 'u003',
      comentario:
        'Gran curso para quienes buscan especializarse en inspección de tuberías.',
      calificacion: 5,
      fecha: new Date('2023-08-20'),
    },
  ];

  findAll() {
    return this.comentarios;
  }

  findOne(id: string) {
    const comentario = this.comentarios.find(
      (comentario) => comentario._id === id,
    );
    if (!comentario) {
      throw new NotFoundException(
        `No se encontró ningún comentario con el id ${id}`,
      );
    }
    return comentario;
  }

  create(payload: any) {
    const newComentario = {
      _id: `c${(this.comentarios.length + 1).toString().padStart(3, '0')}`, // Genera un ID incremental basado en el número de elementos
      ...payload,
      fecha: new Date(), // Asume que la fecha del comentario es la actual
    };
    this.comentarios.push(newComentario);
    return newComentario;
  }

  update(id: string, payload: any) {
    const index = this.comentarios.findIndex(
      (comentario) => comentario._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ningún comentario con el id ${id} para actualizar`,
      );
    }
    this.comentarios[index] = { ...this.comentarios[index], ...payload };
    return this.comentarios[index];
  }

  delete(id: string) {
    const index = this.comentarios.findIndex(
      (comentario) => comentario._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ningún comentario con el id ${id} para eliminar`,
      );
    }
    const comentarioEliminado = this.comentarios[index];
    this.comentarios = this.comentarios.filter(
      (comentario) => comentario._id !== id,
    );
    return comentarioEliminado;
  }
}
