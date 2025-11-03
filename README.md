
# Guía rápida de despliegue 
## Backend

### Iniciar el backend 



```bash
# Levantar MongoDB con Docker
dco up -d mongo

# Iniciar el backend
npm run start
```

### Iniciar el backend Reseteanado la base de datos y clonar desde Railway

```bash
# Eliminar la base de datos local y clona la de Railway
./clone-database.sh

# Iniciar el backend
npm run start
```

---

## Frontend

### Despliegue en local

```bash
npm run dev:local
```

### Despliegue para producción

```bash
npm run dev
```

---

## Requisitos previos

* Node.js y npm instalados.
* Docker y Docker Compose configurados.
* Acceso a Railway (credenciales/tokens) para el script `clone-database.sh`.

---

## Consejos

* Si `mongo` no levanta, verifica los logs:

  ```bash
  dco logs -f mongo
  ```





<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->





























## Entidades

  x categorias
  x comentarios
  x cuestionario
  x cuestionario-respuesta-usuario
  x cursos
  estructuraProgramaria
  x instructores
  ordenes
  progreso-cursos
  x usuarios


En todos los Resolver **Mutation** se debe almacenar el usuario que hace cambios, crea, actualiza, elimina.

Para implementar el codigo  de "me olvide la contraseña" primero se debe usar la funcion **requestPasswordResetInput**, luego crear una ruta que capture el token y la nueva contraseña ambos argumentos necesarios para usar  la funcion **resetPasswordInput**

En todos los metodos crear las funciones create, en las cuales almacena al usuario que esta creando ese doccumento.

En todos los metodos update se debe agregar el usuario que esta creando el documento

En todos los metodos delete se debe agregar el usuario que esta eliminando el documento

  _______________________
  
Categoria
Comentario
Cuestionario
Pregunta
CuestionarioRespuestaUsuario
RespuestaUsuario
Curso
EstructuraProgramaria
UnidadEducativa
Instructor
Orden
ProgresoCurso
Usuario
Perfil
CursoComprado




## incializando proyecto  con apiKey particular

`NODE_API_KEY=CHULAtor npm run start --watch`
`NODE_ENV=dev npm run start --watch`
 

## comando para iniciar nest en produccion
nest start --watch



## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
