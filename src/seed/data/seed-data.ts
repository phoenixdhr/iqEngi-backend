import { Nivel, RolEnum } from 'src/common/enums';

export const SEED_CATEGORIA = [
  {
    nombre: 'Quimica',
    descripcion: 'asi CHICDCD',
  },
];

export const SEED_COMENTARIO = [
  {
    comentario: 'es un curso bien chingon',
    fecha: new Date('2024-05-12T13:58:57.221Z'),
  },
  {
    comentario: 'es un curso bien chingon',
    fecha: new Date('2024-06-27T04:56:16.228Z'),
  },
  {
    comentario: 'es un curso bien chingon',
    fecha: new Date('2024-06-28T04:38:41.446Z'),
  },
];

export const SEED_CUESTIONARIO = [
  {
    tituloCuestionario: 'primer cuestionario',
    descripcionCuestionario: 'primera descripcion de cuestionario',
    fecha: new Date('2024-05-13T05:25:48.359Z'),
  },
  {
    tituloCuestionario: 'Segundocuestionario',
    descripcionCuestionario: 'segunda descripcion de cuestionario',
    fecha: new Date('2024-05-13T05:25:48.359Z'),
  },
];

export const SEED_PREGUNTA = [];

export const SEED_CUESTIONARIORESPUESTAUSUARIO = [
  {
    estado: 'sin_empezar',
    respuestas: [
      {
        respuestaId: [],
      },
    ],
  },
  {
    estado: 'sin_empezar',
    respuestas: [
      {
        respuestaId: [],
      },
    ],
  },
  {
    estado: 'sin_empezar',
    respuestas: [
      {
        respuestaId: [],
      },
      {
        respuestaId: [],
      },
    ],
  },
  {
    estado: 'sin_empezar',
    respuestas: [],
  },
  {
    estado: 'sin_empezar',
    respuestas: [],
  },
  {
    estado: 'sin_empezar',
    respuestas: [],
  },
  {
    estado: 'sin_empezar',
    respuestas: [],
  },
  {
    estado: 'sin_empezar',
    respuestas: [],
  },
  {
    estado: 'sin_empezar',
    respuestas: [],
  },
];

export const SEED_RESPUESTAUSUARIO = [];

export const SEED_CURSO = [
  {
    title:
      'API 1160 Gestión de la Integridad del Sistema para Tuberías de Líquidos Peligrosos',
    descripcionCorta:
      'Aprende a gestionar la integridad de sistemas de tuberías para líquidos peligrosos según API 1160.',
    nivel: Nivel.Intermedio,
    duracionHoras: 50,
    imagenURL: 'https://example.com/api1160.jpg',
    precio: 300,
    descuentos: 15,
    calificacion: 4.8,
    aprenderas: [
      'Principios de gestión de integridad según API 1160',
      'Evaluación de riesgos y mitigación',
      'Supervisión y mantenimiento de tuberías',
    ],
    objetivos: [
      'Implementar un plan de integridad eficaz',
      'Reducir riesgos en el manejo de líquidos peligrosos',
    ],
    dirigidoA: [
      'Ingenieros de seguridad',
      'Supervisores de planta',
      'Técnicos especializados',
    ],
    estructuraProgramaria: [],
    fechaLanzamiento: new Date('2024-07-01T00:00:00.000Z'),

    categorias: ['66403d29527cde5a27fbeada'],
  },
  {
    title:
      'API 650 Gestión de la Integridad del Sistema para Tuberías de Líquidos Peligrosos',
    descripcionCorta:
      'Aprende a gestionar la integridad de sistemas de tuberías para líquidos peligrosos según API 650.',
    nivel: Nivel.Intermedio,
    duracionHoras: 50,
    imagenURL: 'https://example.com/api1160.jpg',
    precio: 250,
    descuentos: 15,
    calificacion: 4.8,
    aprenderas: [
      'Principios de gestión de integridad según API 1160',
      'Evaluación de riesgos y mitigación',
      'Supervisión y mantenimiento de tuberías',
    ],
    objetivos: [
      'Implementar un plan de integridad eficaz',
      'Reducir riesgos en el manejo de líquidos peligrosos',
    ],
    dirigidoA: [
      'Ingenieros de seguridad',
      'Supervisores de planta',
      'Técnicos especializados',
    ],
    fechaLanzamiento: new Date('2024-07-01T00:00:00.000Z'),

    categorias: ['66403d29527cde5a27fbeada'],
  },
  {
    title:
      'ASME B31.4 Gestión de la Integridad del Sistema para Tuberías de Líquidos Peligrosos',
    descripcionCorta:
      'Aprende a gestionar la integridad de sistemas de tuberías para líquidos peligrosos según API 650.',
    nivel: Nivel.Intermedio,
    duracionHoras: 50,
    imagenURL: 'https://example.com/api1160.jpg',
    precio: 300,
    descuentos: 15,
    calificacion: 4.8,
    aprenderas: [
      'Principios de gestión de integridad según API 1160',
      'Evaluación de riesgos y mitigación',
      'Supervisión y mantenimiento de tuberías',
    ],
    objetivos: [
      'Implementar un plan de integridad eficaz',
      'Reducir riesgos en el manejo de líquidos peligrosos',
    ],
    dirigidoA: [
      'Ingenieros de seguridad',
      'Supervisores de planta',
      'Técnicos especializados',
    ],
    estructuraProgramaria: [],
    fechaLanzamiento: new Date('2024-07-01T00:00:00.000Z'),

    categorias: ['66403d29527cde5a27fbeada'],
  },
  {
    title:
      'ASME B31.8 Gestión de la Integridad del Sistema para Tuberías de Líquidos Peligrosos',
    descripcionCorta:
      'Aprende a gestionar la integridad de sistemas de tuberías para líquidos peligrosos según API 650.',
    nivel: Nivel.Intermedio,
    duracionHoras: 50,
    imagenURL: 'https://example.com/api1160.jpg',
    precio: 300,
    descuentos: 15,
    calificacion: 4.8,
    aprenderas: [
      'Principios de gestión de integridad según API 1160',
      'Evaluación de riesgos y mitigación',
      'Supervisión y mantenimiento de tuberías',
    ],
    objetivos: [
      'Implementar un plan de integridad eficaz',
      'Reducir riesgos en el manejo de líquidos peligrosos',
    ],
    dirigidoA: [
      'Ingenieros de seguridad',
      'Supervisores de planta',
      'Técnicos especializados',
    ],
    estructuraProgramaria: [],
    fechaLanzamiento: new Date('2024-07-01T00:00:00.000Z'),

    categorias: ['66403d29527cde5a27fbeada'],
  },
  {
    title: 'curso 111111111',
    descripcionCorta: 'este curso es la polla, macho',
    aprenderas: [],
    objetivos: [],
    dirigidoA: [],
    estructuraProgramaria: [],
    categorias: [],
    nivel: Nivel.Intermedio,
  },
  {
    title: 'curso 222222222222',
    descripcionCorta: '6',
    aprenderas: [],
    objetivos: [],
    dirigidoA: [],
    estructuraProgramaria: [],
    categorias: [],
  },
];

export const SEED_ESTRUCTURAPROGRAMARIA = [
  {
    modulo: 4,
    titleModulo: 'forth',
    unidades: [
      {
        unidad: 11,
        title: 'chimichangas',
        temas: [],
      },
    ],
  },
];

export const SEED_UNIDADEDUCATIVA = [
  {
    unidad: 11,
    title: 'chimichangas',
    temas: [],
  },
];

export const SEED_INSTRUCTOR = [
  {
    nombre: 'Carlos',
    apellidos: 'Martínez',
    profesion: 'Ingeniero en Seguridad Industrial',
    especializacion: [
      'Gestión de Riesgos',
      'Integridad de Sistemas',
      'Normativa API 1160',
    ],
    calificacionPromedio: 4.8,
    pais: 'Colombia',
  },
];

export const SEED_ORDEN = [
  {
    cursos: [],
    estado: 'pendiente',
    montoTotal: 550,
  },
  {
    cursos: [],
    estado: 'pendiente',
    montoTotal: 550,
  },
  {
    cursos: [],
    estado: 'pendiente',
    montoTotal: 550,
  },
];

export const SEED_PROGRESOCURSO = [
  {
    cuestionariosRespuestaUsuarioId: [],
    progresoTotal: 0,
  },
  {
    cuestionariosRespuestaUsuarioId: [],
    progresoTotal: 0,
  },
  { cuestionariosRespuestaUsuarioId: [], progresoTotal: 0 },
];

export const SEED_USUARIO = [
  {
    firstName: 'dany_1',
    lastName: 'null',
    email: 'dany_1@gmail.com',
    password: '1234',
    email_verified: false,
    roles: [RolEnum.ESTUDIANTE],
    isActive: true,
    notificaciones: true,
  },
  {
    firstName: 'null_1',
    lastName: 'null',
    email: 'null_1@gmail.com',
    password: '1234',
    email_verified: false,
    roles: [RolEnum.ADMINISTRADOR],
    isActive: true,
    notificaciones: true,
  },
];

export const SEED_PERFIL = [];

export const SEED_CURSOCOMPRADO = [
  {
    estadoAcceso: 'activo',
  },
  {
    estadoAcceso: 'activo',
  },
];
