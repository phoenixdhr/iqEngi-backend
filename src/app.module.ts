import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CursoModule } from './modules/curso/curso.module';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { InstructorModule } from './modules/instructor/instructor.module';
import { OrdenModule } from './modules/orden/orden.module';
import { ComentarioModule } from './modules/comentario/comentario.module';
import { CuestionarioModule } from './modules/cuestionario/cuestionario.module';
import { CuestionarioRespuestaModule } from './modules/cuestionario-respuesta/cuestionario-respuesta.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DatabaseModule } from './database/database.module';
import { fileEnvironment } from './common/enviroments/fileEnvironment';
import configEnv from './common/enviroments/configEnv';
import { configValidationSchema } from './common/enviroments/configValidationSchema';
import { MongooseUtilsServiceModule } from './mongoose-utils-service/mongoose-utils-service.module';
import { AuthModule } from './modules/auth/auth.module';
import { join } from 'path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { CalificacionModule } from './modules/calificacion/calificacion.module';
import { CursoCompradoModule } from './modules/curso-comprado/curso-comprado.module';
import { MailModule } from './modules/mail/mail.module';
// import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false, // Deshabilitamos el playground deprecado
      context: ({ req, res }) => ({ req, res }), // Configura el contexto con req y res
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }), // Usamos el nuevo plugin
      ],
      subscriptions: {
        'graphql-ws': true, // (NUEVO) Habilitamos las suscripciones con graphql-ws
      },
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? fileEnvironment[process.env.NODE_ENV]
        : '.env',
      isGlobal: true,
      load: [configEnv],
      validationSchema: configValidationSchema,
    }),
    MongooseUtilsServiceModule,
    DatabaseModule,
    AuthModule,
    CalificacionModule,
    CategoriaModule,
    ComentarioModule,
    CuestionarioModule,
    CuestionarioRespuestaModule,
    CursoModule,
    CursoCompradoModule,
    InstructorModule,
    OrdenModule,
    UsuarioModule,
    MailModule,
    // SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(cookieParser()).forRoutes('*'); // Configura cookie-parser para todas las rutas
//   }
// }
