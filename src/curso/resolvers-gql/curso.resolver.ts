import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CursoService } from '../services/curso.service';
import { CursoType } from '../entities/type-gql/curso.type';

import { Curso } from '../entities/curso.entity';
import {
  CreateCursoInput,
  UpdateCursoInput,
} from '../dtos/input-gql/curso.input';

@Resolver()
export class CursoResolver {
  constructor(private readonly cursoService: CursoService) {}

  // crea un query para devolver todos los cursos
  @Query(() => [CursoType], { name: 'cursos' })
  async findAll(): Promise<Curso[]> {
    return this.cursoService.findAll();
  }

  // crea un query para devolver un curso por id
  @Query(() => CursoType, { name: 'curso' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Curso> {
    return this.cursoService.findOne(id);
  }

  @Mutation(() => CursoType, { name: 'createCurso' })
  async createCurso(
    @Args('dto') dto: CreateCursoInput, // dto es el objeto que se va a crear
  ): Promise<Curso> {
    return this.cursoService.create(dto);
  }

  @Mutation(() => CursoType, { name: 'updateCurso' })
  async updateCurso(
    @Args('id', { type: () => ID }) id: string,
    @Args('dto') dto: UpdateCursoInput,
  ): Promise<Curso> {
    return this.cursoService.update(id, dto);
  }

  @Mutation(() => CursoType, { name: 'deleteCurso' })
  async deleteCurso(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Curso> {
    return this.cursoService.delete(id);
  }
}
