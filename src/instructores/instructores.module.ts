import { Module } from '@nestjs/common';
import { InstructoresController } from './controllers/instructores.controller';
import { InstructoresService } from './services/instructores.service';
import { Instructores, InstructorSchema } from './entities/instructores.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instructores.name, schema: InstructorSchema },
    ]),
  ],
  controllers: [InstructoresController],
  providers: [InstructoresService],
})
export class InstructoresModule {}
