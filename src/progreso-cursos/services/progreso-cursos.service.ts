import { Injectable, NotFoundException } from '@nestjs/common';
import { ProgresoCurso } from '../entities/progreso-curso.entity';

@Injectable()
export class ProgresoCursosService {
  private progresoCursos: ProgresoCurso[] = [
    {
      _id: 'pc101',
      cursoId: '101',
      usuarioId: 'u001',
      evaluacionUsuario: ['cr001'], // ID de CuestionarioRespuestaUsuario correspondiente
      progresoTotal: 100, // Suponiendo que 'u001' completó el 100% del curso '101'
      // Nota y estado podrían ser calculados basándose en las respuestas del cuestionario
    },
    {
      _id: 'pc102',
      cursoId: '102',
      usuarioId: 'u002',
      evaluacionUsuario: ['cr002'], // ID de CuestionarioRespuestaUsuario correspondiente
      progresoTotal: 100, // Suponiendo que 'u002' completó el 100% del curso '102'
      // Nota y estado podrían ser calculados basándose en las respuestas del cuestionario
    },
    {
      _id: 'pc103',
      cursoId: '103',
      usuarioId: 'u003',
      evaluacionUsuario: ['cr003'], // ID de CuestionarioRespuestaUsuario correspondiente
      progresoTotal: 100, // Suponiendo que 'u003' completó el 100% del curso '103'
      // Nota y estado podrían ser calculados basándose en las respuestas del cuestionario
    },
  ];

  findAll() {
    return this.progresoCursos;
  }

  findOne(id: string) {
    const progresoCurso = this.progresoCursos.find(
      (progreso) => progreso._id === id,
    );
    if (!progresoCurso) {
      throw new NotFoundException(
        `No se encontró ningún progreso de curso con el id ${id}`,
      );
    }
    return progresoCurso;
  }

  create(payload: any) {
    const newProgresoCurso = {
      _id: `pc${(this.progresoCursos.length + 1).toString().padStart(3, '0')}`, // Genera un ID incremental
      ...payload,
    };
    this.progresoCursos.push(newProgresoCurso);
    return newProgresoCurso;
  }

  update(id: string, payload: any) {
    const index = this.progresoCursos.findIndex(
      (progreso) => progreso._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ningún progreso de curso con el id ${id} para actualizar`,
      );
    }
    this.progresoCursos[index] = { ...this.progresoCursos[index], ...payload };
    return this.progresoCursos[index];
  }

  delete(id: string) {
    const index = this.progresoCursos.findIndex(
      (progreso) => progreso._id === id,
    );
    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ningún progreso de curso con el id ${id} para eliminar`,
      );
    }
    const progresoCursoEliminado = this.progresoCursos[index];
    this.progresoCursos = this.progresoCursos.filter(
      (progreso) => progreso._id !== id,
    );
    return progresoCursoEliminado;
  }
}
