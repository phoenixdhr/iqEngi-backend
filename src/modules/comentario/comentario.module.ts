import { Module } from '@nestjs/common';
import { ComentariosController } from './controllers/comentarios.controller';
import { ComentarioService } from './services/comentario.service';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ComentarioResolver } from './resolvers/comentario.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentarioSchema },
    ]),
  ],
  controllers: [ComentariosController],
  providers: [ComentarioService, ComentarioResolver],
  exports: [ComentarioService],
})
export class ComentarioModule {}
