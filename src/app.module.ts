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
// import { SeedModule } from './seed/seed.module';
import { CalificacionModule } from './modules/calificacion/calificacion.module';
import { CursoCompradoModule } from './modules/curso-comprado/curso-comprado.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // debug: false,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
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
    // SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
