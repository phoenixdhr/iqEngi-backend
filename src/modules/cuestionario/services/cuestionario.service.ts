import { Injectable } from '@nestjs/common';
import { Cuestionario } from '../entities/cuestionario.entity';
import { UpdateCuestionarioInput } from '../dtos/cuestionario-dtos/update-cuestionario.input';
import { CreateCuestionarioInput } from '../dtos/cuestionario-dtos/create-cuestionario.input';
import { BaseService } from 'src/common/services/base.service';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CursoService } from 'src/modules/curso/services/curso.service';
import { UpdateCursoInput } from 'src/modules/curso/dtos/curso-dtos/update-curso.input';

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
    const cursoIdAsigned = new Types.ObjectId(createCuestionarioInput.cursoId);

    // Verificar si ya existe un cuestionario para el curso
    const existingCuestionario = await this.cuestionarioModel.findOne({
      cursoId: cursoIdAsigned,
    });

    if (existingCuestionario) {
      throw new Error(
        // en español
        `A cuestionario already exists for cursoId: ${cursoIdAsigned}, ID del Cuestionario que ya existe para dicho curso es : ${existingCuestionario._id}`,
      );
    }

    // Crear el nuevo cuestionario
    const newCuestionario = await super.create(
      { ...createCuestionarioInput, cursoId: cursoIdAsigned },
      userid,
    );

    // Actualizar el curso relacionado con el cuestionario

    const dtoUpdateCurso = {
      cuestionarioId: new Types.ObjectId(newCuestionario._id),
    } as UpdateCursoInput;

    await this.cursoService.update(cursoIdAsigned, dtoUpdateCurso, userid);

    return newCuestionario;
  }

  async findById(cuestionarioId: Types.ObjectId): Promise<Cuestionario> {
    const cuestionario = super.findById_WithSubDocuments_ActiveOrInactive(
      cuestionarioId,
      'preguntas',
      false,
    );

    return cuestionario;
  }
}
