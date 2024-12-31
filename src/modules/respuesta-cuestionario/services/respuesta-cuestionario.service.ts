import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { RespuestaCuestionario } from '../entities/respuesta-cuestionario.entity';
import { UpdateRespuestaCuestionarioInput } from '../dtos/respuesta-cuestionario-dtos/update-respuesta-cuestionario.dto';
import { CreateRespuestaCuestionarioInput } from '../dtos/respuesta-cuestionario-dtos/create-respuesta-cuestionario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CursoService } from 'src/modules/curso/services/curso.service';
import { CursoCompradoService } from 'src/modules/curso-comprado/services/curso-comprado.service';
import { CursoComprado } from 'src/modules/curso-comprado/entities/curso-comprado.entity';
import { UsuarioService } from 'src/modules/usuario/services/usuario.service';

@Injectable()
export class RespuestaCuestionarioService extends BaseService<
  RespuestaCuestionario,
  UpdateRespuestaCuestionarioInput,
  CreateRespuestaCuestionarioInput
> {
  constructor(
    @InjectModel(RespuestaCuestionario.name)
    private readonly respuestaCuestionarioModel: Model<RespuestaCuestionario>, // Mongoose Model para gestionar los documentos de RespuestaCuestionario.
    private readonly cursoService: CursoService, // Servicio para realizar operaciones relacionadas con Cursos.
    private readonly cursoCompradoService: CursoCompradoService, // Servicio para realizar operaciones relacionadas con Cursos comprados.
    private readonly usuarioService: UsuarioService, // Servicio para realizar operaciones relacionadas con Usuarios.
  ) {
    super(respuestaCuestionarioModel); // Inicializa el servicio base con el modelo de RespuestaCuestionario.
  }

  /**
   * Crea una nueva RespuestaCuestionario asociada a un curso específico.
   *
   * Este método verifica si el usuario ha comprado el curso correspondiente y si
   * el curso tiene un cuestionario asociado. Si las verificaciones son exitosas,
   * crea una nueva RespuestaCuestionario vinculada al curso y al usuario.
   *
   * @param CreateRespuestaCuestionario Datos necesarios para crear una RespuestaCuestionario.
   * @param idUser ID del usuario que está creando la RespuestaCuestionario.
   * @returns La RespuestaCuestionario creada.
   * @throws Error si el usuario no ha comprado el curso o si el curso no tiene un cuestionario asociado.
   */
  async create(
    CreateRespuestaCuestionario: Partial<CreateRespuestaCuestionarioInput> & {
      cursoId: Types.ObjectId;
    },
    idUser: Types.ObjectId,
  ): Promise<RespuestaCuestionario> {
    // Obtiene todos los cursos comprados por el usuario
    const arrayCursosComprados: CursoComprado[] =
      await this.cursoCompradoService.findByUsuarioId(idUser);

    const cursoId = new Types.ObjectId(CreateRespuestaCuestionario.cursoId);

    // Verifica si el usuario ha comprado el curso asociado al cuestionario
    const cursoComprado = arrayCursosComprados.find(
      (element) => String(element.cursoId) === String(cursoId),
    );

    if (!cursoComprado) {
      throw new Error(
        `El usuario con ID: ${idUser} no ha comprado el curso con ID: ${cursoId}.`,
      );
    }

    // Busca el curso y verifica si tiene un cuestionario asociado
    const curso = await this.cursoService.findById(cursoId);
    const idCuestionario = new Types.ObjectId(curso.cuestionarioId);

    if (!idCuestionario) {
      throw new Error(
        `El curso con ID: ${cursoId} no tiene un cuestionario asociado.`,
      );
    }

    // Crea una nueva respuesta al cuestionario utilizando el servicio base
    const newRespuestaCuestionario = await super.create(
      {
        ...CreateRespuestaCuestionario,
        cursoId,
        cuestionarioId: idCuestionario,
        usuarioId: idUser,
      },
      idUser,
    );

    return newRespuestaCuestionario as RespuestaCuestionario;
  }

  /**
   * Busca respuestas a cuestionarios asociadas a un curso específico.
   *
   * @param cursoId ID del curso para el cual se quieren obtener las respuestas.
   * @returns Una lista de RespuestaCuestionario asociadas al curso.
   */
  async findByCursoId(
    cursoId: Types.ObjectId,
  ): Promise<RespuestaCuestionario[]> {
    //verifica que el curso exista en la base de datos y lanza un mensaje si no existe
    await this.cursoService.findById(cursoId);

    return this.respuestaCuestionarioModel.find({ cursoId }).exec();
  }

  /**
   * Busca respuestas a cuestionarios asociadas a un usuario específico.
   *
   * @param usuarioId ID del usuario para el cual se quieren obtener las respuestas.
   * @returns Una lista de RespuestaCuestionario asociadas al usuario.
   */
  async findByUsuarioId(
    usuarioId: Types.ObjectId,
  ): Promise<RespuestaCuestionario[]> {
    await this.usuarioService.findById(usuarioId);
    return this.respuestaCuestionarioModel.find({ usuarioId }).exec();
  }
}
