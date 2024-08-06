import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CursosModule } from './cursos/cursos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { InstructoresModule } from './instructores/instructores.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { ProgresoCursosModule } from './progreso-cursos/progreso-cursos.module';
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
import { HelloWorldModule } from './hello-world/hello-world.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

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
    CursosModule,
    CategoriasModule,
    UsuariosModule,
    InstructoresModule,
    OrdenesModule,
    ComentariosModule,
    ProgresoCursosModule,
    CuestionarioModule,
    CuestionarioRespuestaUsuarioModule,
    DatabaseModule,
    EstructuraProgramariaModule,
    AuthModule,
    HelloWorldModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
