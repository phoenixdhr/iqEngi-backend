export const SEED_CATEGORIA = [
  {
    _id: {
      $oid: '66403d29527cde5a27fbeada',
    },
    nombre: 'Quimica',
    descripcion: 'asi CHICDCD',
    __v: 0,
  },
];

export const SEED_COMENTARIO = [
  {
    _id: {
      $oid: '6640cb21ca0d0d9f9cdbd96e',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    usuarioId: '66403cc4527cde5a27fbead3',
    comentario: 'es un curso bien chingon',
    fecha: {
      $date: '2024-05-12T13:58:57.221Z',
    },
    __v: 0,
  },
  {
    _id: {
      $oid: '667cf0f012f8fc3071178b1e',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    usuarioId: '667cdc15458e34ec1fc82aa1',
    comentario: 'es un curso bien chingon',
    fecha: {
      $date: '2024-06-27T04:56:16.228Z',
    },
    __v: 0,
  },
  {
    _id: {
      $oid: '667e3e51dc778fe61e2ba041',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    usuarioId: '667e3ddadc778fe61e2ba026',
    comentario: 'es un curso bien chingon',
    fecha: {
      $date: '2024-06-28T04:38:41.446Z',
    },
    __v: 0,
  },
];

export const SEED_CUESTIONARIO = [
  {
    _id: {
      $oid: '664207ffe875da73f16f384d',
    },
    tituloCuestionario: 'primer cuestionario',
    descripcionCuestionario: 'primera descripcion de cuestionario',
    fecha: {
      $date: '2024-05-13T05:25:48.359Z',
    },
    unidadEducativaId: '664207b9e875da73f16f3844',
    preguntas: [
      {
        enunciado: 'Cual es el simbolo quimico del agua',
        tipoPregunta: 'alternativa',
        opciones: [
          {
            textOpcion: 'H2O',
            esCorrecta: 1,
            _id: {
              $oid: '66420839e875da73f16f3859',
            },
          },
        ],
        _id: {
          $oid: '6642081ae875da73f16f3854',
        },
      },
    ],
    __v: 2,
  },
  {
    _id: {
      $oid: '66fda656a587ab5ef9d36c12',
    },
    tituloCuestionario: 'Segundocuestionario',
    descripcionCuestionario: 'primera descripcion de cuestionario',
    fecha: {
      $date: '2024-05-13T05:25:48.359Z',
    },
    unidadEducativaId: '664207b9e875da73f16f3844',
    preguntas: [
      {
        enunciado: 'Cual es el simbolo quimico del agua',
        tipoPregunta: 'alternativa',
        opciones: [
          {
            textOpcion: 'H2O',
            esCorrecta: 1,
            _id: {
              $oid: '66420839e875da73f16f3859',
            },
          },
        ],
        _id: {
          $oid: '6642081ae875da73f16f3854',
        },
      },
    ],
    __v: 2,
  },
];

export const SEED_PREGUNTA = [];

export const SEED_CUESTIONARIORESPUESTAUSUARIO = [
  {
    _id: {
      $oid: '66420dbce875da73f16f38e2',
    },
    usuarioId: '66420bdae875da73f16f38c9',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [
      {
        preguntaId: '6642081ae875da73f16f3854',
        respuestaId: ['66420839e875da73f16f3859'],
        _id: {
          $oid: '66422a8af258ecde93f48f3a',
        },
      },
    ],
    __v: 1,
  },
  {
    _id: {
      $oid: '667cefeb12f8fc3071178b0c',
    },
    usuarioId: '667cdc15458e34ec1fc82aa1',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [
      {
        preguntaId: '6642081ae875da73f16f3854',
        respuestaId: ['66420839e875da73f16f3859'],
        _id: {
          $oid: '667cf07112f8fc3071178b14',
        },
      },
    ],
    __v: 1,
  },
  {
    _id: {
      $oid: '667e3e5adc778fe61e2ba049',
    },
    usuarioId: '667e3ddadc778fe61e2ba026',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [
      {
        preguntaId: '6642081ae875da73f16f3854',
        respuestaId: ['66420839e875da73f16f3859'],
        _id: {
          $oid: '667e3e73dc778fe61e2ba04f',
        },
      },
      {
        preguntaId: '6642081ae875da73f16f3854',
        respuestaId: ['66420839e875da73f16f3859'],
        _id: {
          $oid: '667e3f5adc778fe61e2ba05f',
        },
      },
    ],
    __v: 2,
  },
  {
    _id: {
      $oid: '667e3ed7dc778fe61e2ba058',
    },
    usuarioId: '667e3ddadc778fe61e2ba026',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [],
    __v: 0,
  },
  {
    _id: {
      $oid: '667e411ddc778fe61e2ba06a',
    },
    usuarioId: '667e3ddadc778fe61e2ba026',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [],
    __v: 0,
  },
  {
    _id: {
      $oid: '667e4199dc778fe61e2ba08e',
    },
    usuarioId: '667e3ddadc778fe61e2ba026',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [],
    __v: 0,
  },
  {
    _id: {
      $oid: '667e41f0a5972a88530c1ff0',
    },
    usuarioId: '667e3ddadc778fe61e2ba026',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [],
    __v: 0,
  },
  {
    _id: {
      $oid: '667e420ba5972a88530c1ff8',
    },
    usuarioId: '667e3ddadc778fe61e2ba026',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [],
    __v: 0,
  },
  {
    _id: {
      $oid: '667e4218a5972a88530c2000',
    },
    usuarioId: '667e3ddadc778fe61e2ba026',
    cursoId: '66403db1527cde5a27fbeadc',
    unidadEducativaId: '664207b9e875da73f16f3844',
    cuestionarioId: '664207ffe875da73f16f384d',
    estado: 'sin_empezar',
    respuestas: [],
    __v: 0,
  },
];

export const SEED_RESPUESTAUSUARIO = [];

export const SEED_CURSO = [
  {
    _id: {
      $oid: '66403db1527cde5a27fbeadc',
    },
    title:
      'API 1160 Gestión de la Integridad del Sistema para Tuberías de Líquidos Peligrosos',
    descripcionCorta:
      'Aprende a gestionar la integridad de sistemas de tuberías para líquidos peligrosos según API 1160.',
    nivel: 'Avanzado',
    instructor: '66403d1a527cde5a27fbead8',
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
    estructuraProgramaria: [
      {
        $oid: '66419a68e741976a8b9c5ca2',
      },
    ],
    fechaLanzamiento: {
      $date: '2024-07-01T00:00:00.000Z',
    },
    categorias: ['66403d29527cde5a27fbeada'],
    __v: 1,
  },
  {
    _id: {
      $oid: '664043ed38e097bb9240f589',
    },
    title:
      'API 650 Gestión de la Integridad del Sistema para Tuberías de Líquidos Peligrosos',
    descripcionCorta:
      'Aprende a gestionar la integridad de sistemas de tuberías para líquidos peligrosos según API 650.',
    nivel: 'Avanzado',
    instructor: '66403d1a527cde5a27fbead8',
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
    fechaLanzamiento: {
      $date: '2024-07-01T00:00:00.000Z',
    },
    categorias: ['66403d29527cde5a27fbeada'],
    __v: 0,
  },
  {
    _id: {
      $oid: '667a4e9cfe6a83c4f3abb42e',
    },
    title:
      'ASME B31.4 Gestión de la Integridad del Sistema para Tuberías de Líquidos Peligrosos',
    descripcionCorta:
      'Aprende a gestionar la integridad de sistemas de tuberías para líquidos peligrosos según API 650.',
    nivel: 'Avanzado',
    instructor: '66403d1a527cde5a27fbead8',
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
    fechaLanzamiento: {
      $date: '2024-07-01T00:00:00.000Z',
    },
    categorias: ['66403d29527cde5a27fbeada'],
    __v: 0,
  },
  {
    _id: {
      $oid: '667ce7e01006f3057d017523',
    },
    title:
      'ASME B31.8 Gestión de la Integridad del Sistema para Tuberías de Líquidos Peligrosos',
    descripcionCorta:
      'Aprende a gestionar la integridad de sistemas de tuberías para líquidos peligrosos según API 650.',
    nivel: 'Avanzado',
    instructor: '66403d1a527cde5a27fbead8',
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
    fechaLanzamiento: {
      $date: '2024-07-01T00:00:00.000Z',
    },
    categorias: ['66403d29527cde5a27fbeada'],
    __v: 0,
  },
  {
    _id: {
      $oid: '66b3d1744030f4cede6d9f4c',
    },
    title: 'curso 111111111',
    descripcionCorta: 'este curso es la polla, macho',
    aprenderas: [],
    objetivos: [],
    dirigidoA: [],
    estructuraProgramaria: [],
    categorias: [],
    __v: 0,
    nivel: 'Principiante',
  },
  {
    _id: {
      $oid: '66b3d3c5819e8437c964d730',
    },
    title: 'curso 222222222222',
    descripcionCorta: '6',
    aprenderas: [],
    objetivos: [],
    dirigidoA: [],
    estructuraProgramaria: [],
    categorias: [],
    __v: 0,
  },
];

export const SEED_ESTRUCTURAPROGRAMARIA = [
  {
    _id: {
      $oid: '66419a68e741976a8b9c5ca2',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    modulo: 4,
    titleModulo: 'forth',
    unidades: [
      {
        unidad: 11,
        title: 'chimichangas',
        temas: [],
        idEstructuraProgramaria: '66419a68e741976a8b9c5ca2',
        _id: {
          $oid: '664207b9e875da73f16f3844',
        },
        __v: 0,
        idCuestionario: '664207ffe875da73f16f384d',
      },
    ],
    __v: 2,
  },
];

export const SEED_UNIDADEDUCATIVA = [
  {
    _id: {
      $oid: '664207b9e875da73f16f3844',
    },
    unidad: 11,
    title: 'chimichangas',
    idEstructuraProgramaria: '66419a68e741976a8b9c5ca2',
    temas: [],
    __v: 0,
    idCuestionario: '664207ffe875da73f16f384d',
  },
];

export const SEED_INSTRUCTOR = [
  {
    _id: {
      $oid: '66403d1a527cde5a27fbead8',
    },
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
    __v: 0,
  },
];

export const SEED_ORDEN = [
  {
    _id: {
      $oid: '66420bfee875da73f16f38ce',
    },
    usuarioId: '66420bdae875da73f16f38c9',
    cursos: [
      {
        $oid: '66403db1527cde5a27fbeadc',
      },
      {
        $oid: '664043ed38e097bb9240f589',
      },
    ],
    estado: 'pendiente',
    montoTotal: 550,
    __v: 0,
  },
  {
    _id: {
      $oid: '667cf0a712f8fc3071178b19',
    },
    usuarioId: '66420bdae875da73f16f38c9',
    cursos: [
      {
        $oid: '66403db1527cde5a27fbeadc',
      },
      {
        $oid: '664043ed38e097bb9240f589',
      },
    ],
    estado: 'pendiente',
    montoTotal: 550,
    __v: 0,
  },
  {
    _id: {
      $oid: '667e3e4bdc778fe61e2ba03c',
    },
    usuarioId: '66420bdae875da73f16f38c9',
    cursos: [
      {
        $oid: '66403db1527cde5a27fbeadc',
      },
      {
        $oid: '664043ed38e097bb9240f589',
      },
    ],
    estado: 'pendiente',
    montoTotal: 550,
    __v: 0,
  },
];

export const SEED_PROGRESOCURSO = [
  {
    _id: {
      $oid: '66420c26e875da73f16f38d5',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    usuarioId: '66420bdae875da73f16f38c9',
    cuestionariosRespuestaUsuarioId: [
      {
        $oid: '66420dbce875da73f16f38e2',
      },
    ],
    progresoTotal: 0,
    __v: 1,
  },
  {
    _id: {
      $oid: '667cea2494d404f0dff8dff6',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    usuarioId: '667cdc15458e34ec1fc82aa1',
    cuestionariosRespuestaUsuarioId: [
      {
        $oid: '667cefeb12f8fc3071178b0c',
      },
    ],
    progresoTotal: 0,
    __v: 1,
  },
  {
    _id: {
      $oid: '667e3e0fdc778fe61e2ba02f',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    usuarioId: '667cdc15458e34ec1fc82aa1',
    cuestionariosRespuestaUsuarioId: [],
    progresoTotal: 0,
    __v: 0,
  },
];

export const SEED_USUARIO = [
  {
    _id: {
      $oid: '66b59e06c5f0ab6cebece17c',
    },
    firstName: 'dany209',
    lastName: 'null',
    email: 'siseñar2@gmail.com',
    hashPassword:
      '$2b$10$KhtkpWlZIH/xilyGkWx2ROjoQy6a3HZ8cQ15YdzCN2rUJ1R3GX3H2',
    rol: 'estudiante',
    perfil: {
      _id: {
        $oid: '66b59e06c5f0ab6cebece17b',
      },
      intereses: [],
    },
    cursos_comprados: [],
    __v: 0,
  },
  {
    _id: {
      $oid: '66d9361ed5eab63770140e42',
    },
    firstName: 'null',
    lastName: 'null',
    email: 'null123455@gmail.com',
    email_verified: false,
    hashPassword:
      '$2b$10$nlH8cvkoRfW/qpgGZKY.9OBx2sxwbVIj.AIbGgRQcyJtlmfwDDDWu',
    roles: ['administrador'],
    perfil: {
      _id: {
        $oid: '66d9361ed5eab63770140e41',
      },
      intereses: [],
    },
    cursos_comprados: [],
    __v: 0,
    isActive: true,
    notificaciones: true,
  },
];

export const SEED_PERFIL = [];

export const SEED_CURSOCOMPRADO = [
  {
    _id: {
      $oid: '66420c26e875da73f16f38d7',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    estadoAcceso: 'activo',
    progresoCursoId: {
      $oid: '66420c26e875da73f16f38d5',
    },
    __v: 0,
  },
  {
    _id: {
      $oid: '667cea2494d404f0dff8dff8',
    },
    cursoId: '66403db1527cde5a27fbeadc',
    estadoAcceso: 'activo',
    progresoCursoId: {
      $oid: '667cea2494d404f0dff8dff6',
    },
    __v: 0,
  },
];
