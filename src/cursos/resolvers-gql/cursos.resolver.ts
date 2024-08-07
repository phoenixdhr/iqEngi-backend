import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CursosService } from '../services/cursos.service';
import { CursoType } from '../entities/type-gql/cursos.type';

import { Curso } from '../entities/curso.entity';
import { CursoInput } from '../dtos/input-gql/curso.input';

@Resolver()
export class CursosResolver {
  constructor(private readonly cursoService: CursosService) {}

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
    @Args('dto') dto: CursoInput, // dto es el objeto que se va a crear
  ): Promise<Curso> {
    return this.cursoService.create(dto);
  }
}
