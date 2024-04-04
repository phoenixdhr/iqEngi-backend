import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port } from './_common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora los campos que no se esperan, eliminándolos del resultado.
      forbidNonWhitelisted: true, // Arroja un error si se reciben campos que no se esperan.
      transform: true, // Transforma el payload de entrada a su tipo de clase DTO correspondiente.
      disableErrorMessages: false, // Para producción podría considerarse cambiar a true.
      validationError: { target: false }, // Opcional: Evita devolver el objeto que falló en la validación en la respuesta de error.
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('IqEngi description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(port);
}

bootstrap();
