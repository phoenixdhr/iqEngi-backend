import { Module } from '@nestjs/common';
import { InstructoresController } from './controllers/instructores.controller';
import { InstructoresService } from './services/instructores.service';

@Module({
  controllers: [InstructoresController],
  providers: [InstructoresService],
})
export class InstructoresModule {}
