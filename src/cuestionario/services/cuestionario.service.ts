import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cuestionario, Pregunta } from '../entities/cuestionario.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCuestionarioDto,
  CreateOpcionDto,
  CreatePreguntaDto,
  UpdateCuestionarioDto,
  UpdatePreguntaDto,
} from '../dtos/cuestionario.dto';
import { UnidadEducativaService } from 'src/estructura-programaria/services/unidad-educativa.service';
import { EstructuraProgramariaService } from 'src/estructura-programaria/services/estructura-programaria.service';

@Injectable()
export class CuestionarioService {
  constructor(
    @Inject(forwardRef(() => UnidadEducativaService))
    private readonly unidadEducativaService: UnidadEducativaService,
    @Inject(forwardRef(() => EstructuraProgramariaService))
    private readonly estructuraProgramariaService: EstructuraProgramariaService,
    @InjectModel(Cuestionario.name)
    private readonly cuestionarioModel: Model<Cuestionario>,
    @InjectModel(Pregunta.name) private readonly preguntaModel: Model<Pregunta>,
  ) {}

  //#region CRUD service
  async findAll() {
    return this.cuestionarioModel.find().exec();
  }

  async findOne(id: string) {
    const cuestionario = await this.cuestionarioModel.findById(id).exec();

    if (!cuestionario) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id}`,
      );
    }
    return cuestionario;
  }

  async create(data: CreateCuestionarioDto) {
    const newCuestionario = new this.cuestionarioModel(data);
    await newCuestionario.save();
    return newCuestionario;
  }

  async update(id: string, changes: UpdateCuestionarioDto) {
    const updateCuestionario = await this.cuestionarioModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!updateCuestionario) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id} para actualizar`,
      );
    }

    return updateCuestionario;
  }

  async delete(id: string) {
    const cuestionarioEliminado = await this.cuestionarioModel
      .findByIdAndDelete(id)
      .exec();

    if (!cuestionarioEliminado) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${id} para eliminar`,
      );
    }

    return cuestionarioEliminado;
  }

  // SE GUARDA UNICAMENTE EN CUESTIONARIO - NO TIENE UNA COLECCION PROPIA
  //#region CRUD Schema Pregunta
  async addPregunta(cuestionarioId: string, preguntaData: CreatePreguntaDto) {
    const cuestionario = await this.findOne(cuestionarioId);
    // const pregunta = await cuestionario.preguntas.create(preguntaData);
    const pregunta = new this.preguntaModel(preguntaData);
    cuestionario.preguntas.push(pregunta);
    await cuestionario.save();

    return pregunta;
  }

  async findAllPreguntas(cuestionarioId: string) {
    const cuestionario = await this.findOne(cuestionarioId);
    return cuestionario.preguntas;
  }

  async findPregunta(cuestionarioId: string, preguntaId: string) {
    const cuestionario = await this.findOne(cuestionarioId);
    const pregunta = cuestionario.preguntas.id(preguntaId);

    if (!pregunta) {
      throw new NotFoundException(
        `No se encontró ninguna pregunta con el id ${preguntaId}`,
      );
    }

    return pregunta;
  }

  //#region Update Schema Pregunta
  // async updatePregunta(preguntaId: string, changes: UpdatePreguntaDto) {
  //   const pregunta = await this.preguntaModel
  //     .findByIdAndUpdate(preguntaId, { $set: changes }, { new: true })
  //     .exec();

  //   if (!pregunta) {
  //     throw new NotFoundException(
  //       `No se encontró ninguna pregunta con el id ${preguntaId} para actualizar`,
  //     );
  //   }

  //   return pregunta;
  // }

  async updatePregunta(
    cuestionarioId: string,
    preguntaId: string,
    changes: UpdatePreguntaDto,
  ) {
    const cuestionario = await this.findOne(cuestionarioId);
    const pregunta = cuestionario.preguntas.id(preguntaId);

    if (!pregunta) {
      throw new NotFoundException(
        `No se encontró ninguna pregunta con el id ${preguntaId}`,
      );
    }

    pregunta.set(changes);
    await cuestionario.save();

    return pregunta;
  }

  //#region Delete Schema Pregunta
  // async deletePregunta(preguntaId: string) {
  //   const preguntaEliminada = await this.preguntaModel
  //     .findByIdAndDelete(preguntaId)
  //     .exec();

  //   if (!preguntaEliminada) {
  //     throw new NotFoundException(
  //       `No se encontró ninguna pregunta con el id ${preguntaId} para eliminar`,
  //     );
  //   }

  //   return preguntaEliminada;
  // }

  async deletePregunta(cuestionarioId: string, preguntaId: string) {
    const cuestionario = await this.findOne(cuestionarioId);
    const pregunta = cuestionario.preguntas.id(preguntaId);

    if (!pregunta) {
      throw new NotFoundException(
        `No se encontró ninguna pregunta con el id ${preguntaId}`,
      );
    }

    cuestionario.preguntas.pull(pregunta);
    await cuestionario.save();
    // await this.preguntaModel.findByIdAndDelete(preguntaId).exec();
    return cuestionario;
  }

  // #region CRUD Schema Opcion
  // SE GUARDA UNICAMENTE EN CUESTIONARIO, DENTRO DE LA PREGUNTA - NO TIENE UNA COLECCION PROPIA
  async addOpcion(
    cuestionarioId: string,
    preguntaId: string,
    data: CreateOpcionDto,
  ) {
    const cuestionario: Cuestionario = await this.findOne(cuestionarioId);

    const pregunta: Pregunta = cuestionario.preguntas.id(preguntaId);
    if (!pregunta) {
      throw new NotFoundException(
        `No se encontró ninguna pregunta con el id ${preguntaId}`,
      );
    }

    pregunta.opciones.push(data);
    await cuestionario.save();

    return pregunta;
  }

  async findAllOpciones(cuestionarioId: string, preguntaId: string) {
    const cuestionario = await this.findOne(cuestionarioId);
    const pregunta = cuestionario.preguntas.id(preguntaId);

    return pregunta.opciones;
  }

  async findOpcion(
    cuestionarioId: string,
    preguntaId: string,
    opcionId: string,
  ) {
    const cuestionario = await this.findOne(cuestionarioId);

    const pregunta = cuestionario.preguntas.id(preguntaId);
    if (!pregunta) {
      throw new NotFoundException(
        `No se encontró ninguna pregunta con el id ${preguntaId}`,
      );
    }

    const opcion = pregunta.opciones.id(opcionId);
    if (!opcion) {
      throw new NotFoundException(
        `No se encontró ninguna opción con el id ${opcionId}`,
      );
    }

    return opcion;
  }

  async updateOpcion(
    cuestionarioId: string,
    preguntaId: string,
    opcionId: string,
    changes: CreateOpcionDto,
  ) {
    const cuestionario = await this.findOne(cuestionarioId);

    const pregunta = cuestionario.preguntas.id(preguntaId);
    if (!pregunta) {
      throw new NotFoundException(
        `No se encontró ninguna pregunta con el id ${preguntaId}`,
      );
    }

    const opcion = pregunta.opciones.id(opcionId);

    if (!opcion) {
      throw new NotFoundException(
        `No se encontró ninguna opción con el id ${opcionId}`,
      );
    }

    opcion.set(changes);
    await cuestionario.save();

    return opcion;
  }

  async deleteOpcion(
    cuestionarioId: string,
    preguntaId: string,
    opcionId: string,
  ) {
    const cuestionario = await this.findOne(cuestionarioId);

    const pregunta = cuestionario.preguntas.id(preguntaId);
    if (!pregunta) {
      throw new NotFoundException(
        `No se encontró ninguna pregunta con el id ${preguntaId}`,
      );
    }

    const opcion = pregunta.opciones.id(opcionId);
    if (!opcion) {
      throw new NotFoundException(
        `No se encontró ninguna opción con el id ${opcionId}`,
      );
    }

    pregunta.opciones.pull(opcion);
    await cuestionario.save();

    return pregunta;
  }

  //#region Find
  // NOTA NO SE ESTA USANDO findUnidadEducativaIdCursoIdByCuestionarioId
  async findUnidadEducativaIdCursoIdByCuestionarioId(cuestionarioId: string) {
    const cuestionario = await this.cuestionarioModel
      .findById(cuestionarioId)
      .exec();

    if (!cuestionario) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario con el id ${cuestionarioId}`,
      );
    }
    const unidadEducativa =
      await this.unidadEducativaService.filterdByIdCuestionario(cuestionarioId);

    if (!unidadEducativa) {
      throw new NotFoundException(
        `No se encontró ninguna unidad educativa con el id ${cuestionarioId}`,
      );
    }

    const estructuraProgramaria =
      await this.estructuraProgramariaService.findOne(
        unidadEducativa.idEstructuraProgramaria.toString(),
      );

    const unidadEducativaId: string = unidadEducativa._id.toString();
    const cursoId: string = estructuraProgramaria.cursoId.toString();

    return { unidadEducativaId, cursoId };
  }

  //#region Filter
  async filterByCursoId(cursoId: string) {
    const cuestionarios = await this.cuestionarioModel
      .find({ curso: cursoId })
      .exec();

    if (!cuestionarios) {
      throw new NotFoundException(
        `No se encontró ningún cuestionario para el curso con el id ${cursoId}`,
      );
    }

    return cuestionarios;
  }
}
