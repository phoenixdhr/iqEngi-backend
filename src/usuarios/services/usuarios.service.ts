import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Usuario,
  RolUsuario,
  EstadoAccesoCurso,
  CursoComprado,
  ProgresoId,
} from '../entities/usuario.entity';

import { OrdenesService } from '../../ordenes/services/ordenes.service';
import { Orden } from 'src/ordenes/entities/orden.entity';
import { Comentario } from 'src/comentarios/entities/comentario.entity';
import { ComentariosService } from 'src/comentarios/services/comentarios.service';
import { CuestionarioRespuestaUsuarioService } from 'src/cuestionario-respuesta-usuario/services/cuestionario-respuesta-usuario.service';
import { CuestionarioRespuestaUsuario } from 'src/cuestionario-respuesta-usuario/entities/cuestionario-respuesta-usuario.entity';
import { ProgresoCursosService } from 'src/progreso-cursos/services/progreso-cursos.service';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly comentariosService: ComentariosService,
    private readonly progresoCursosService: ProgresoCursosService,
    private readonly cuestionarioRespuestaUsuarioService: CuestionarioRespuestaUsuarioService,
  ) {}
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

  findCursosComprados(id: string): CursoComprado[] {
    const usuario = this.findOne(id); // Utiliza el método existente para garantizar que el usuario exista
    return usuario.cursos_comprados_historial || [];
  }

  findProgresoCursos(id: string): ProgresoId[] {
    const usuario = this.findOne(id);
    return usuario.curso_progreso || [];
  }

  findOrdenes(usuarioId: string): Orden[] {
    const ordenes = this.ordenesService
      .findAll()
      .filter((orden) => orden.usuarioId === usuarioId);
    if (!ordenes) {
      throw new NotFoundException(
        `Ordenes para el usuario con ID ${usuarioId} no encontradas`,
      );
    }
    return ordenes;
  }

  findComentarios(usuarioId: string): Comentario[] {
    const comentarios = this.comentariosService
      .findAll()
      .filter((comentario) => comentario.usuarioId === usuarioId);
    if (!comentarios) {
      throw new NotFoundException(
        `Comentarios para el usuario con ID ${usuarioId} no encontrados`,
      );
    }
    return comentarios;
  }

  //CORREGIR
  findAllCuestionariosRespondidos(
    usuarioId: string,
  ): CuestionarioRespuestaUsuario[] {
    const cuestionariosRespuestaUsuario =
      this.cuestionarioRespuestaUsuarioService
        .findAll()
        .filter((cuestionario) => cuestionario.usuarioId === usuarioId);
    if (!cuestionariosRespuestaUsuario) {
      throw new NotFoundException(
        `Cuestionarios no encontrados con ID ${usuarioId}`,
      );
    }
    return cuestionariosRespuestaUsuario;
  }

  findCuestionarioRespondidoPorCurso(usuarioId: string, cursoId: string) {
    // const cuestionariosRespuestaUsuario = this.findOne(usuarioId).curso_progreso;
    // const cuestionarioRespuestaCurso = cuestionariosRespuestaUsuario.find(
    //   (evaluaciones) => evaluaciones.cursoId === cursoId,
    // );
    // const idProgresocurso = cuestionarioRespuestaCurso.progresoCursoId

    const cuestionariosAllRespuestaUsuario =
      this.findAllCuestionariosRespondidos(usuarioId);
    const cuestionariosRespuestasCurso = cuestionariosAllRespuestaUsuario.find(
      (evaluaciones) => evaluaciones.cursoId === cursoId,
    );
    if (!cuestionariosRespuestasCurso) {
      throw new NotFoundException(
        `El usuario con ID ${usuarioId} no ha respondido ningun curso con ID ${cursoId}`,
      );
    }
    return cuestionariosRespuestasCurso;
  }
}
