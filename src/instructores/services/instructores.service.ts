import { Injectable, NotFoundException } from '@nestjs/common';
import { Instructor } from '../entities/instructores.entity';

@Injectable()
export class InstructoresService {
  private counter = 3; // Asumimos que ya tienes 3 instructores
  private instructores: Instructor[] = [
    {
      _id: '1',
      nombre: 'Roberto',
      apellidos: 'González',
      profesion: 'Ingeniero Mecánico',
      especializacion: ['Diseño de tanques de almacenamiento', 'Normas API'],
      calificacionPromedio: undefined, // Opcional, inicialmente puede no estar presente
      pais: undefined, // Opcional, inicialmente puede no estar presente
    },
    {
      _id: '2',
      nombre: 'Mariana',
      apellidos: 'López',
      profesion: 'Ingeniera Industrial',
      especializacion: ['Recipientes a presión', 'Normativa ASME'],
      // No es necesario incluir campos opcionales si no se provee un valor
    },
    {
      _id: '3',
      nombre: 'José',
      apellidos: 'Ramírez',
      profesion: 'Ingeniero Mecánico',
      especializacion: ['Inspección de tuberías', 'Normas API'],
      // Los campos opcionales no incluidos son considerados undefined automáticamente
    },
  ];

  findAll() {
    return this.instructores;
  }

  findOne(id: string) {
    const instructor = this.instructores.find((inst) => inst._id === id);
    if (!instructor) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id}`,
      );
    }
    return instructor;
  }

  create(createInstructorDto: any) {
    this.counter++;
    const newInstructor = {
      _id: this.counter.toString(),
      ...createInstructorDto,
    };

    this.instructores.push(newInstructor);
    return newInstructor;
  }

  update(id: string, updateInstructorDto: any) {
    const index = this.instructores.findIndex((inst) => inst._id === id);

    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id} para actualizar`,
      );
    }

    this.instructores[index] = {
      ...this.instructores[index],
      ...updateInstructorDto,
    };

    return this.instructores[index];
  }

  delete(id: string) {
    const index = this.instructores.findIndex((inst) => inst._id === id);

    if (index === -1) {
      throw new NotFoundException(
        `No se encontró ningún instructor con el ID ${id} para eliminar`,
      );
    }

    const instructor = this.instructores[index];
    this.instructores = this.instructores.filter((inst) => inst._id !== id);
    return instructor;
  }
}
