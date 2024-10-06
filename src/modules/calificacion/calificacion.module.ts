import { Module } from '@nestjs/common';
import { CalificacionService } from './services/calificacion.service';
import { CalificacionController } from './controllers/calificacion.controller';
import { CalificacionResolver } from './resolvers/calificacion.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Calificacion,
  CalificacionSchema,
} from './entities/calificacion.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calificacion.name, schema: CalificacionSchema },
    ]),
  ],
  providers: [CalificacionService, CalificacionResolver],
  controllers: [CalificacionController],
})
export class CalificacionModule {}
