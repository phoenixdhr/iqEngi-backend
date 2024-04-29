import { Module } from '@nestjs/common';
import { ComentariosController } from './controllers/comentarios.controller';
import { ComentariosService } from './services/comentarios.service';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentarioSchema },
    ]),
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService],
})
export class ComentariosModule {}
