import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import {
  RespuestaCuestionario as Cuestionario,
  RespuestaCuestionario,
} from '../entities/respuesta-cuestionario.entity';
import { UpdateRespuestaCuestionarioInput } from '../dtos/respuesta-cuestionario-dtos/update-respuesta-cuestionario.dto';
import { CreateRespuestaCuestionarioInput } from '../dtos/respuesta-cuestionario-dtos/create-respuesta-cuestionario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CursoService } from 'src/modules/curso/services/curso.service';

import { UsuarioService } from 'src/modules/usuario/services/usuario.service';
import { EstadoCuestionario, TipoPregunta } from 'src/common/enums';
import { CuestionarioService } from 'src/modules/cuestionario/services/cuestionario.service';
import { RespuestaPreguntaService } from './respuesta-pregunta.service';

@Injectable()
export class RespuestaCuestionarioService extends BaseService<
  RespuestaCuestionario,
  UpdateRespuestaCuestionarioInput,
  CreateRespuestaCuestionarioInput
> {
  constructor(
    @InjectModel(RespuestaCuestionario.name)
    private readonly respuestaCuestionarioModel: Model<RespuestaCuestionario>, // Mongoose Model para gestionar los documentos de RespuestaCuestionario.
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>, // Mongoose Model para gestionar los documentos de RespuestaCuestionario.

    private readonly cursoService: CursoService, // Servicio para realizar operaciones relacionadas con Cursos.
    /* private readonly cursoCompradoService: CursoCompradoService, // Servicio para realizar operaciones relacionadas con Cursos comprados. */
    private readonly usuarioService: UsuarioService, // Servicio para realizar operaciones relacionadas con Usuarios.
    private readonly cuestionarioService: CuestionarioService,
    private readonly respuestaPreguntaService: RespuestaPreguntaService,
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
  async _create(
    CreateRespuestaCuestionario: Partial<CreateRespuestaCuestionarioInput> & {
      cursoId: Types.ObjectId;
    },
    idUser: Types.ObjectId,
  ): Promise<Cuestionario> {
    // Obtiene todos los cursos comprados por el usuario
    const cursoId = new Types.ObjectId(CreateRespuestaCuestionario.cursoId);

    /* const arrayCursosComprados: CursoComprado[] =
      await this.cursoCompradoService.findByUsuarioId(idUser);


    // Verifica si el usuario ha comprado el curso asociado al cuestionario
    const cursoComprado = arrayCursosComprados.find(
      (element) => String(element.cursoId) === String(cursoId),
    );

    if (!cursoComprado) {
      throw new Error(
        `El usuario con ID: ${idUser} no ha comprado el curso con ID: ${cursoId}.`,
      );
    } */

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

    return newRespuestaCuestionario as Cuestionario;
  }

  /**
   * Busca respuestas a cuestionarios asociadas a un curso específico.
   *
   * @param cursoId ID del curso para el cual se quieren obtener las respuestas.
   * @returns Una lista de RespuestaCuestionario asociadas al curso.
   */
  async findByCursoId(cursoId: Types.ObjectId): Promise<Cuestionario[]> {
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
  async findByUsuarioId(usuarioId: Types.ObjectId): Promise<Cuestionario[]> {
    await this.usuarioService.findById(usuarioId);
    return this.respuestaCuestionarioModel.find({ usuarioId }).exec();
  }

  async calcularNota(
    idRespuestaCuestionario: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<number> {
    const respuestaCuestionario = await this.respuestaCuestionarioModel
      .findById(idRespuestaCuestionario)
      .exec();

    if (!respuestaCuestionario) {
      throw new NotFoundException(
        `No se encontró RespuestaCuestionario con ID: ${idRespuestaCuestionario}`,
      );
    }

    // Cargamos el cuestionario con sus preguntas
    const cuestionario = await this.cuestionarioService.findById(
      respuestaCuestionario.cuestionarioId,
    );

    if (!cuestionario) {
      throw new NotFoundException(
        `No se encontró Cuestionario con ID: ${respuestaCuestionario.cuestionarioId}`,
      );
    }

    let notaAcumulada = 0;

    for (const resp of respuestaCuestionario.respuestas) {
      const pregunta = cuestionario.preguntas.find(
        (p) => String(p._id) === String(resp.preguntaId),
      );
      if (!pregunta) continue; // Si no existe la pregunta, la ignoramos

      // Si la pregunta es abierta, no se considera en la nota
      if (pregunta.tipoPregunta === TipoPregunta.ABIERTA) {
        continue;
      }

      // Tomamos los puntos de la pregunta (1 por defecto si no hay 'puntos')
      const puntosPregunta = pregunta.puntos ?? 1;

      // IDs de opciones correctas
      const idsOpcionesCorrectas = pregunta.opciones
        .filter((op) => op.esCorrecta)
        .map((op) => String(op._id));

      // IDs que marcó el usuario
      // const idsSeleccionadasUsuario = (resp.respuestaId || []).map((op) =>
      //   String(op._id),
      // );

      const idsSeleccionadasUsuario = [...resp.respuestaId]
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        .map((op) => String(op._id));

      let esCorrecto = false;

      switch (pregunta.tipoPregunta) {
        case TipoPregunta.ALTERNATIVA:
          // Basta con que el usuario haya elegido al menos una opción correcta
          if (
            idsOpcionesCorrectas.some((idCorrecta) =>
              idsSeleccionadasUsuario.includes(idCorrecta),
            )
          ) {
            esCorrecto = true;
          }
          break;

        case TipoPregunta.OPCION_MULTIPLE: {
          // Debe marcar TODAS (y solo) las correctas
          const setCorrectas = new Set(idsOpcionesCorrectas);
          const setUsuario = new Set(idsSeleccionadasUsuario);
          if (
            setCorrectas.size === setUsuario.size &&
            [...setCorrectas].every((id) => setUsuario.has(id))
          ) {
            esCorrecto = true;
          }
          break;
        }

        case TipoPregunta.ORDENAMIENTO: {
          // Comparar el orden elegido vs. el orden correcto (según campo 'orden')
          const ordenCorrecto = [...pregunta.opciones]
            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((op) => String(op._id));

          const coincideOrden =
            ordenCorrecto.length === idsSeleccionadasUsuario.length &&
            ordenCorrecto.every(
              (id, idx) => String(id) === String(idsSeleccionadasUsuario[idx]),
            );
          if (coincideOrden) {
            esCorrecto = true;
          }
          break;
        }
      }

      if (esCorrecto) {
        notaAcumulada += puntosPregunta;
        await this.respuestaPreguntaService.updateInArray(
          idRespuestaCuestionario,
          resp._id,
          userId,
          { esCorrecto: true },
        );
      }
    }

    // Ejemplo: Determina 'Aprobado' si supera cierto umbral, de lo contrario 'Desaprobado'
    // (Ajusta la lógica y el umbral a tu necesidad real)
    if (notaAcumulada >= cuestionario.notaMinimaAprobar) {
      respuestaCuestionario.estado = EstadoCuestionario.Aprobado;
    } else {
      respuestaCuestionario.estado = EstadoCuestionario.Desaprobado;
    }

    respuestaCuestionario.nota = notaAcumulada;
    respuestaCuestionario.updatedBy = userId;
    await respuestaCuestionario.save();

    // return respuestaCuestionario;
    return notaAcumulada;
  }
}
