import { Injectable } from '@nestjs/common';
import { Instructor } from '../entities/instructor.entity';
import { UpdateInstructorInput } from '../dtos/update-instructor.input';
import { CreateInstructorInput } from '../dtos/create-instructor.input';
import { BaseService } from 'src/common/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationArgs, SearchTextArgs } from 'src/common/dtos';
import SearchField from 'src/common/clases/search-field.class';

@Injectable()
export class InstructorService extends BaseService<
  Instructor,
  UpdateInstructorInput,
  CreateInstructorInput
> {
  constructor(
    @InjectModel(Instructor.name)
    private readonly instructorModel: Model<Instructor>,
  ) {
    super(instructorModel);
  }

  async findAllByNombre(
    searchTextArgs: SearchTextArgs,
    paginationArgs?: PaginationArgs,
  ): Promise<Instructor[]> {
    const searchField: SearchField<Instructor> = new SearchField();
    searchField.field = 'firstName';

    return super.findAllBy(
      searchTextArgs,
      searchField,
      paginationArgs,
    ) as Promise<Instructor[]>;
  }
}
