import { Module } from '@nestjs/common';
import { ComentariosController } from './controllers/comentarios.controller';
import { ComentariosService } from './services/comentarios.service';

@Module({
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
