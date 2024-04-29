import { Module } from '@nestjs/common';
import { EstructuraProgramariaService } from './services/estructura-programaria.service';
import { EstructuraProgramariaController } from './controllers/estructura-programaria.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EstructuraProgramaria,
  EstructuraProgramariaSchema,
} from './entities/estructura-programaria.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EstructuraProgramaria.name, schema: EstructuraProgramariaSchema },
    ]),
  ],
  providers: [EstructuraProgramariaService],
  controllers: [EstructuraProgramariaController],
})
export class EstructuraProgramariaModule {}
