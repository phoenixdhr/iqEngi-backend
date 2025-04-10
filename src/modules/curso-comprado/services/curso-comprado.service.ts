import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { CursoComprado } from '../entities/curso-comprado.entity';
import { UpdateCursoCompradoInput } from '../dtos/update-curso-comprado.input';
import { CreateCursoCompradoInput } from '../dtos/create-curso-comprado.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CursoService } from 'src/modules/curso/services/curso.service';
import { RespuestaCuestionarioService } from 'src/modules/respuesta-cuestionario/services/respuesta-cuestionario.service';

@Injectable()
export class CursoCompradoService extends BaseService<
  CursoComprado,
  UpdateCursoCompradoInput,
  CreateCursoCompradoInput
> {
  constructor(
    @InjectModel(CursoComprado.name)
    private readonly cursoCompradoModel: Model<CursoComprado>,
    private readonly cursoService: CursoService,
    private readonly respuestaCuestionarioService: RespuestaCuestionarioService,
  ) {
    super(cursoCompradoModel);
  }
  //#region Métodos Generales IBaseResolver modificados
  /**
   * Crea una nueva calificación.
   * @param createCursoCompradoInput Datos para crear la calificación.
   * @returns La calificación creada.
   */
  async create(
    createCursoCompradoInput: CreateCursoCompradoInput,
    userid: Types.ObjectId,
  ): Promise<CursoComprado> {
    const idCurso = new Types.ObjectId(createCursoCompradoInput.cursoId);

    const curso = await this.cursoService.findById(idCurso);

    if (!curso) {
      throw new NotFoundException('El curso no existe');
    }

    const data = {
      ...createCursoCompradoInput,
      cursoId: new Types.ObjectId(createCursoCompradoInput.cursoId),
      usuarioId: new Types.ObjectId(createCursoCompradoInput.usuarioId),
      courseTitle: curso.courseTitle,
    };

    const newCursoComprado = await super.create({ ...data }, userid);

    // const respuestaCuestionario =
    //   await this.respuestaCuestionarioService._create(
    //     {
    //       cursoId: idCurso,
    //     },
    //     userid,
    //   );

    return newCursoComprado;
  }

  //#region Métodos Personales
  /**
   * Obtiene cursoCompradoes por curso ID.
   * @param cursoId ID del curso.
   * @returns Un array de cursoCompradoes del curso.
   */
  async findByCursoId(cursoId: Types.ObjectId): Promise<CursoComprado[]> {
    return this.cursoCompradoModel.find({ cursoId }).exec();
  }

  /**
   * Obtiene cursoCompradoes por usuario ID.
   * @param usuarioId ID del usuario.
   * @returns Un array de cursoCompradoes del usuario.
   */
  async findByUsuarioId(usuarioId: Types.ObjectId): Promise<CursoComprado[]> {
    return this.cursoCompradoModel.find({ usuarioId }).exec();
  }
}
