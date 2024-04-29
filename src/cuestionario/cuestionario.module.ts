import { Module } from '@nestjs/common';
import { CuestionarioService } from './services/cuestionario.service';
import { CuestionarioController } from './controllers/cuestionario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Cuestionario,
  CuestionarioSchema,
} from './entities/cuestionario.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cuestionario.name, schema: CuestionarioSchema },
    ]),
  ],
  providers: [CuestionarioService],
  controllers: [CuestionarioController],
  exports: [CuestionarioService],
})
export class CuestionarioModule {}
