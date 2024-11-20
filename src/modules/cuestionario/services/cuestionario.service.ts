import { Injectable } from '@nestjs/common';
import { Cuestionario } from '../entities/cuestionario.entity';
import { UpdateCuestionarioInput } from '../dtos/cuestionario-dtos/update-cuestionario.input';
import { CreateCuestionarioInput } from '../dtos/cuestionario-dtos/create-cuestionario.input';
import { BaseService } from 'src/common/services/base.service';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CursoService } from 'src/modules/curso/services/curso.service';

@Injectable()
export class CuestionarioService extends BaseService<
  Cuestionario,
  UpdateCuestionarioInput,
  CreateCuestionarioInput
> {
  constructor(
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>, // Renombrado para mayor claridad
    private readonly cursoService: CursoService,
  ) {
    super(cuestionarioModel);
  }

  /**
   * Crea un nuevo cuestionario.
   *
   * Antes de crear un cuestionario, verifica si ya existe uno asociado al curso.
   * Si ya existe, lanza un error para evitar duplicados.
   *
   * @param createCuestionarioInput Datos necesarios para crear el cuestionario.
   * @param userid ID del usuario que está creando el cuestionario.
   * @returns El cuestionario creado.
   */
  async create(
    createCuestionarioInput: CreateCuestionarioInput,
    userid: Types.ObjectId,
  ): Promise<Cuestionario> {
    // Verificar si ya existe un cuestionario para el curso
    const existingCuestionario = await this.cuestionarioModel.findOne({
      cursoId: createCuestionarioInput.cursoId,
    });

    if (existingCuestionario) {
      throw new Error(
        // en español
        `A cuestionario already exists for cursoId: ${createCuestionarioInput.cursoId}, ID del Cuestionario que ya existe para dicho curso es : ${existingCuestionario._id}`,
      );
    }

    // Crear el nuevo cuestionario
    const newCuestionario = await super.create(createCuestionarioInput, userid);

    // Actualizar el curso relacionado con el cuestionario
    const idCurso = new Types.ObjectId(createCuestionarioInput.cursoId);
    const dtoUpdateCurso = {
      cuestionarioId: newCuestionario._id,
    } as UpdateCuestionarioInput;

    await this.cursoService.update(idCurso, dtoUpdateCurso, userid);

    return newCuestionario;
  }
}
