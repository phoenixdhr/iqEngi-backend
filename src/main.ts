import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { port } from './common/enviroments/configEnv';

import { WsAdapter } from '@nestjs/platform-ws'; // Importamos el adaptador de WebSocket
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app)); // (NUEVO) Configuramos el adaptador de WebSocket

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora los campos que no se esperan, eliminándolos del resultado.
      // forbidNonWhitelisted: true, // Arroja un error si se reciben campos que no se esperan.

      transform: true, // Transforma el payload de entrada a su tipo de clase DTO correspondiente.
      disableErrorMessages: false, // Para producción podría considerarse cambiar a true.
      validationError: { target: false }, // Opcional: Evita devolver el objeto que falló en la validación en la respuesta de error.
      transformOptions: {
        enableImplicitConversion: true, // Convierte los tipos de los campos automáticamente.
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('IqEngi description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    // origin: 'http://localhost:3000', // Ajusta esto al dominio de tu frontend
    // credentials: true,
  });
  app.use(cookieParser());

  await app.listen(port);
}

bootstrap();
