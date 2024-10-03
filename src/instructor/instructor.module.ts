import { forwardRef, Module } from '@nestjs/common';
import { InstructorController } from './controllers/instructor.controller';
import { InstructorService } from './services/instructor.service';
import { Instructor, InstructorSchema } from './entities/instructor.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CursoModule } from 'src/curso/curso.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Instructor.name, schema: InstructorSchema },
    ]),
    forwardRef(() => CursoModule),
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
