import { Controller, Get, Param } from '@nestjs/common';

@Controller('categorias')
export class CategoriasController {
  @Get('categoria/:id/cursos/:cursoId')
  getProductCategory(@Param() param: { id: string; cursoId: string }): string {
    return `categoria ${param.id} Curso ${param.cursoId}`;
  }
}
