import { Injectable, NotFoundException } from '@nestjs/common';
import { Curso, nivel } from '../entities/curso.entity';
import { OrdenesService } from 'src/ordenes/services/ordenes.service';
import { ComentariosService } from 'src/comentarios/services/comentarios.service';
import { CuestionarioService } from 'src/cuestionario/services/cuestionario.service';

@Injectable()
export class CursosService {
  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly comentariosService: ComentariosService,
    private readonly cuestionarioService: CuestionarioService,
  ) {}
  private counter = 103;

  private cursos: Curso[] = [
    {
      _id: '101',
      title: 'API 650 | Diseño de Tanques de Almacenamiento',
      descripcionCorta:
        'Domina el diseño de tanques de almacenamiento siguiendo los estándares de API 650, desde conceptos básicos hasta aplicaciones avanzadas.',
      nivel: nivel.Intermedio,
      instructor: {
        instructorId: '1',
        nombre: 'Roberto',
        apellidos: 'González',
        profesion: 'Ingeniero Mecánico',
        especializacion: ['Diseño de tanques de almacenamiento', 'Normas API'],
      },
      duracionHoras: 40,
      imagenURL:
        'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
      precio: 450,
      descuentos: 10,
      calificacion: 4.9,
      aprenderas: [
        'Interpretar los estándares API 650',
        'Diseñar tanques de almacenamiento seguros y eficientes',
        'Aplicar consideraciones de diseño en proyectos reales',
      ],
      objetivos: [
        'Conocer las bases del diseño de tanques de almacenamiento',
        'Aplicar normas API 650 en proyectos de ingeniería',
      ],
      dirigidoA: [
        'Ingenieros mecánicos',
        'Diseñadores de equipos industriales',
        'Profesionales en el área de proyectos industriales',
      ],
      contenido: [
        {
          modulo: 1,
          titleModulo: 'Fundamentos de los Tanques de Almacenamiento',
          unidades: [
            {
              unidad: 1,
              title: 'Introducción a API 650',
              temas: ['Historia', 'Importancia'],
            },
            {
              unidad: 2,
              title: 'Tipos de Tanques',
              temas: ['Tanques atmosféricos', 'Tanques de baja presión'],
            },
          ],
        },
        {
          modulo: 2,
          titleModulo: 'Diseño de Tanques según API 650',
          unidades: [
            {
              unidad: 1,
              title: 'Materiales',
              temas: ['Selección de materiales', 'Pruebas de materiales'],
            },
            {
              unidad: 2,
              title: 'Diseño Estructural',
              temas: ['Cálculos de espesor', 'Refuerzos y soportes'],
            },
          ],
        },
        {
          modulo: 3,
          titleModulo: 'Consideraciones de Fabricación y Montaje',
          unidades: [
            {
              unidad: 1,
              title: 'Procesos de Fabricación',
              temas: ['Soldadura', 'Ensamblaje'],
            },
            {
              unidad: 2,
              title: 'Inspección y Pruebas',
              temas: ['Pruebas hidrostáticas', 'Inspecciones no destructivas'],
            },
          ],
        },
      ],
      fechaLanzamiento: new Date('2023-06-15'),
      categoriaIds: ['3'],
    },
    {
      _id: '102',
      title: 'ASME VIII | Diseño de Recipientes sometidos a Presión',
      descripcionCorta:
        'Explora los principios de diseño de recipientes a presión conforme al código ASME Sección VIII, cubriendo desde la selección de materiales hasta las pruebas finales.',
      nivel: nivel.Intermedio,
      instructor: {
        instructorId: '2',
        nombre: 'Mariana',
        apellidos: 'López',
        profesion: 'Ingeniera Industrial',
        especializacion: ['Recipientes a presión', 'Normativa ASME'],
      },
      duracionHoras: 45,
      imagenURL:
        'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
      precio: 500,
      descuentos: 10,
      calificacion: 4.8,
      aprenderas: [
        'Manejar el código ASME Sección VIII',
        'Diseñar recipientes a presión seguros',
        'Realizar cálculos de diseño críticos',
      ],
      objetivos: [
        'Dominar el código ASME Sección VIII para el diseño de recipientes a presión',
        'Aplicar conocimientos en proyectos reales',
      ],
      dirigidoA: [
        'Ingenieros de diseño mecánico',
        'Profesionales en fabricación de equipos a presión',
        'Inspectores de calidad',
      ],
      contenido: [
        {
          modulo: 1,
          titleModulo: 'Introducción a los Recipientes a Presión',
          unidades: [
            {
              unidad: 1,
              title: 'Principios Básicos',
              temas: ['Definiciones', 'Aplicaciones'],
            },
            {
              unidad: 2,
              title: 'Código ASME Sección VIII',
              temas: ['Historia', 'Estructura del código'],
            },
          ],
        },
        {
          modulo: 2,
          titleModulo: 'Diseño de Recipientes a Presión',
          unidades: [
            {
              unidad: 1,
              title: 'Selección de Materiales',
              temas: ['Criterios', 'Propiedades de materiales'],
            },
            {
              unidad: 2,
              title: 'Cálculos de Diseño',
              temas: ['Cálculo de espesores', 'Consideraciones de carga'],
            },
          ],
        },
        {
          modulo: 3,
          titleModulo: 'Fabricación, Inspección y Pruebas',
          unidades: [
            {
              unidad: 1,
              title: 'Procesos de Fabricación',
              temas: ['Soldadura', 'Montaje'],
            },
            {
              unidad: 2,
              title: 'Pruebas y Certificación',
              temas: ['Pruebas no destructivas', 'Certificación de calidad'],
            },
          ],
        },
      ],
      fechaLanzamiento: new Date('2023-07-01'),
      categoriaIds: ['3'],
    },
    {
      _id: '103',
      title: 'API 570 | Inspección y Reparación de Sistemas de Tuberías',
      descripcionCorta:
        'Aprende a inspeccionar y reparar sistemas de tuberías industriales siguiendo los estándares API 570, incluyendo técnicas de inspección y criterios de reparación.',
      nivel: nivel.Intermedio,
      instructor: {
        instructorId: '3',
        nombre: 'José',
        apellidos: 'Ramírez',
        profesion: 'Ingeniero Mecánico',
        especializacion: ['Inspección de tuberías', 'Normas API'],
      },
      duracionHoras: 35,
      imagenURL:
        'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
      precio: 400,
      descuentos: 10,
      calificacion: 4.7,
      aprenderas: [
        'Interpretar la normativa API 570',
        'Identificar y reparar defectos en tuberías',
        'Planificar programas de inspección y mantenimiento',
      ],
      objetivos: [
        'Capacitar en la inspección y reparación de sistemas de tuberías industriales',
        'Preparar para la certificación API 570',
      ],
      dirigidoA: [
        'Ingenieros de mantenimiento',
        'Inspectores de tuberías',
        'Técnicos en instalaciones industriales',
      ],
      contenido: [
        {
          modulo: 1,
          titleModulo: 'Fundamentos de Inspección de Tuberías',
          unidades: [
            {
              unidad: 1,
              title: 'Normativa API 570',
              temas: ['Introducción', 'Alcance y definiciones'],
            },
            {
              unidad: 2,
              title: 'Tipos de Tuberías y Materiales',
              temas: ['Clasificación', 'Selección de materiales'],
            },
          ],
        },
        {
          modulo: 2,
          titleModulo: 'Técnicas de Inspección y Evaluación',
          unidades: [
            {
              unidad: 1,
              title: 'Métodos de Inspección',
              temas: ['Inspección visual', 'Pruebas no destructivas'],
            },
            {
              unidad: 2,
              title: 'Evaluación de Defectos',
              temas: ['Criterios de aceptación', 'Técnicas de medición'],
            },
          ],
        },
        {
          modulo: 3,
          titleModulo: 'Reparación y Mantenimiento de Tuberías',
          unidades: [
            {
              unidad: 1,
              title: 'Técnicas de Reparación',
              temas: ['Soldadura', 'Reemplazo de secciones'],
            },
            {
              unidad: 2,
              title: 'Programas de Mantenimiento',
              temas: ['Planificación', 'Ejecución y seguimiento'],
            },
          ],
        },
      ],
      fechaLanzamiento: new Date('2023-08-10'),
      categoriaIds: ['3'],
    },
  ];

  findAll() {
    return this.cursos;
  }

  findOne(id: string) {
    const curso = this.cursos.find((curso) => curso._id === id);
    if (!curso) {
      throw new NotFoundException(`no se encontro ningun curso con id ${id}`);
    }
    return curso;
  }

  create(payload: any) {
    this.counter++;

    const newCurso = {
      _id: this.counter.toString(),
      ...payload,
    };

    this.cursos.push(newCurso);
    return newCurso;
  }

  update(id: string, payload: any) {
    const index = this.cursos.findIndex((curso) => curso._id === id);

    if (index === -1) {
      throw new NotFoundException(
        `no se encontro ningun elemento con id ${id} para actualizar`,
      );
    }
    this.cursos[index] = {
      ...this.cursos[index],
      ...payload,
    };
    return this.cursos[index];
  }

  delete(id: string) {
    const index = this.cursos.findIndex((curso) => curso._id === id);

    if (index === -1) {
      throw new NotFoundException(
        `no se encontro ningun elemento con id ${id} para eliminar`,
      );
    }
    const cursoEliminado = this.cursos[index];
    this.cursos = this.cursos.filter((curso) => curso._id !== id);
    return cursoEliminado;
  }

  findOrdenes(cursoId: string) {
    // Utiliza el servicio de órdenes para buscar órdenes relacionadas con el cursoId
    // Este método asume que cada orden contiene un array de cursoId(s) asociados
    const ordenes = this.ordenesService
      .findAll()
      .filter((orden) => orden.cursos.includes(cursoId));
    if (!ordenes) {
      throw new NotFoundException(
        `Ordenes para el curso con ID ${cursoId} no encontradas`,
      );
    }
    return ordenes;
  }

  findComentarios(cursoId: string) {
    // Utiliza el servicio de comentarios para buscar comentarios relacionados con el cursoId
    const comentarios = this.comentariosService
      .findAll()
      .filter((comentario) => comentario.cursoId === cursoId);
    if (!comentarios) {
      throw new NotFoundException(
        `Comentarios para el curso con ID ${cursoId} no encontrados`,
      );
    }
    return comentarios;
  }

  findCuestionarios(cursoId: string) {
    // Utiliza el servicio de cuestionarios para buscar cuestionarios relacionados con el cursoId
    const cuestionarios = this.cuestionarioService
      .findAll()
      .filter((cuestionario) => cuestionario.cursoId === cursoId);
    if (!cuestionarios) {
      throw new NotFoundException(
        `Cuestionarios para el curso con ID ${cursoId} no encontrados`,
      );
    }
    return cuestionarios;
  }
}
