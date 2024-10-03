import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CursoModule } from './curso/curso.module';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
import { InstructorModule } from './instructor/instructor.module';
import { OrdenModule } from './orden/orden.module';
import { ComentarioModule } from './comentario/comentario.module';
import { ProgresoCursoModule } from './progreso-curso/progreso-curso.module';
import { CuestionarioModule } from './cuestionario/cuestionario.module';
import { CuestionarioRespuestaUsuarioModule } from './cuestionario-respuesta-usuario/cuestionario-respuesta-usuario.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { DatabaseModule } from './_database/database.module';
import { environment } from './_common/enviroments';
import configEnv from './_common/configEnv';
import { configValidationSchema } from './_common/configValidationSchema';
import { EstructuraProgramariaModule } from './estructura-programaria/estructura-programaria.module';
import { MongooseUtilsServiceModule } from './_mongoose-utils-service/_mongoose-utils-service.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
// import { HelloWorldModule } from './hello-world/hello-world.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { SeedModule } from './seed/seed.module';

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
        ? environment[process.env.NODE_ENV]
        : '.env',
      isGlobal: true,
      load: [configEnv],
      validationSchema: configValidationSchema,
    }),
    MongooseUtilsServiceModule,
    CursoModule,
    CategoriaModule,
    UsuarioModule,
    InstructorModule,
    OrdenModule,
    ComentarioModule,
    ProgresoCursoModule,
    CuestionarioModule,
    CuestionarioRespuestaUsuarioModule,
    DatabaseModule,
    EstructuraProgramariaModule,
    AuthModule,
    // HelloWorldModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
