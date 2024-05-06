import { forwardRef, Module } from '@nestjs/common';
import { InstructoresController } from './controllers/instructores.controller';
import { InstructoresService } from './services/instructores.service';
import { Instructores, InstructorSchema } from './entities/instructores.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CursosModule } from 'src/cursos/cursos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instructores.name, schema: InstructorSchema },
    ]),
    forwardRef(() => CursosModule),
  ],
  controllers: [InstructoresController],
  providers: [InstructoresService],
  exports: [InstructoresService],
})
export class InstructoresModule {}
