import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Usuario,
  RolUsuario,
  EstadoAccesoCurso,
} from '../entities/usuario.entity';

@Injectable()
export class UsuariosService {
  private usuarios: Usuario[] = [
    {
      _id: 'u001',
      nombre: 'Juan',
      apellidos: 'Pérez',
      email: 'juan.perez@example.com',
      hashContraseña: 'hashedPassword123',
      rol: [RolUsuario.Estudiante],
      perfil: {
        bio: 'Apasionado por la ingeniería y el diseño.',
        ubicacion: 'Ciudad de México',
        imagenURL: 'https://example.com/images/juan.jpg',
        contacto: 'contacto@ejemplo.com',
        intereses: ['Ingeniería Mecánica', 'Diseño Industrial'],
      },
      cursos_comprados_historial: [
        {
          cursoId: '101',
          fechaCompra: new Date('2023-06-20'),
          estadoAcceso: EstadoAccesoCurso.Activo,
        },
      ],
      curso_progreso: [
        {
          progresoCursoId: 'pc101', // Este ID debe corresponder al _id de un objeto ProgresoCurso
          cursoId: '101',
        },
      ],
    },
    {
      _id: 'u002',
      nombre: 'María',
      apellidos: 'López',
      email: 'maria.lopez@example.com',
      hashContraseña: 'hashedPassword456',
      rol: [RolUsuario.Estudiante],
      perfil: {
        bio: 'Entusiasta de la tecnología y la innovación.',
        ubicacion: 'Bogotá',
        imagenURL: 'https://example.com/images/maria.jpg',
        contacto: 'maria@ejemplo.com',
        intereses: ['Tecnología', 'Innovación', 'Desarrollo de software'],
      },
      cursos_comprados_historial: [
        {
          cursoId: '102',
          fechaCompra: new Date('2023-07-05'),
          estadoAcceso: EstadoAccesoCurso.Activo,
        },
      ],
      curso_progreso: [
        {
          progresoCursoId: 'pc102',
          cursoId: '102',
        },
      ],
    },
    {
      _id: 'u003',
      nombre: 'Carlos',
      apellidos: 'García',
      email: 'carlos.garcia@example.com',
      hashContraseña: 'hashedPassword789',
      rol: [RolUsuario.Estudiante, RolUsuario.Editor],
      perfil: {
        bio: 'Experto en normativas industriales y certificaciones.',
        ubicacion: 'Madrid',
        imagenURL: 'https://example.com/images/carlos.jpg',
        contacto: 'carlos@ejemplo.com',
        intereses: ['Normativas', 'Certificaciones', 'Seguridad Industrial'],
      },
      cursos_comprados_historial: [
        {
          cursoId: '103',
          fechaCompra: new Date('2023-08-15'),
          estadoAcceso: EstadoAccesoCurso.Activo,
        },
      ],
      curso_progreso: [
        {
          progresoCursoId: 'pc103',
          cursoId: '103',
        },
      ],
    },
    // Se pueden añadir más usuarios según sea necesario
  ];

  findAll(): Usuario[] {
    return this.usuarios;
  }

  findOne(id: string): Usuario {
    const usuario = this.usuarios.find((usuario) => usuario._id === id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  create(payload: any): Usuario {
    // Para este ejemplo, generaremos un ID simple. En un caso real, se podría requerir algo más robusto, como un UUID o un ObjectId de MongoDB.
    const newId = `u${Math.floor(Math.random() * 10000)}`;
    const newUsuario: Usuario = {
      _id: newId,
      ...payload,
    };

    this.usuarios.push(newUsuario);
    return newUsuario;
  }

  update(id: string, payload: any): Usuario {
    const index = this.usuarios.findIndex((usuario) => usuario._id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Usuario con ID ${id} no encontrado para actualizar`,
      );
    }

    // Aquí, simplemente actualizaremos los campos proporcionados en el payload.
    this.usuarios[index] = { ...this.usuarios[index], ...payload };
    return this.usuarios[index];
  }

  delete(id: string): Usuario {
    const index = this.usuarios.findIndex((usuario) => usuario._id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Usuario con ID ${id} no encontrado para eliminar`,
      );
    }

    const usuario = this.usuarios[index];
    this.usuarios = this.usuarios.filter((usuario) => usuario._id !== id);
    return usuario;
  }
}
