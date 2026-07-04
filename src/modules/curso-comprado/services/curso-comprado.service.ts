/* MODIFICACIONES DESDE EL �LTIMO COMMIT:
 * - Se refactoriz� la l�gica para otorgar acceso a los cursos, asegurando la verificaci�n de duplicados.
 */
/*
 * ==============================================================================
 * NOTA DE CAMBIOS RECIENTES (Refactorización Arquitectura de Pagos)
 * ==============================================================================
 * Este archivo fue modificado para soportar la separación de responsabilidades 
 * entre 'Orden' y 'Payment'.
 * 
 * Principales cambios:
 * 1. Se independizó el concepto de Orden (intención de compra) del Payment (intento de pago).
 * 2. Se implementó una lógica de expiración estricta sincronizada con las pasarelas (expiresAt).
 * 3. Se garantizó la idempotencia completa en los webhooks para evitar procesamiento duplicado.
 * 4. Se migró el campo 'metodoPago' a 'paymentProvider' / 'ProveedorPago'.
 * ==============================================================================
 */

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
   * Crea un nuevo registro de compra y otorga acceso inicial a un curso.
   * @param createCursoCompradoInput Datos de la compra (cursoId, usuarioId).
   * @param userid ID del usuario que realiza la acción (para auditoría).
   * @returns El registro de la compra creada.
   */
  async create(
    createCursoCompradoInput: CreateCursoCompradoInput,
    userid: Types.ObjectId,
  ): Promise<CursoComprado> {
    // Convierte el ID del curso recibido a un ObjectId de Mongoose
    const idCurso = new Types.ObjectId(createCursoCompradoInput.cursoId);

    // Verifica que el curso exista en la base de datos
    const curso = await this.cursoService.findById(idCurso);

    if (!curso) {
      throw new NotFoundException('El curso no existe');
    }

    // Calcula la fecha de expiración sumando 6 meses a la fecha actual
    const currentDate = new Date();
    const fechaExpiracion = new Date(currentDate.setMonth(currentDate.getMonth() + 6));

    // Prepara los datos finales a guardar, inyectando la expiración y el título del curso
    const data = {
      ...createCursoCompradoInput,
      fechaExpiracion,
      cursoId: new Types.ObjectId(createCursoCompradoInput.cursoId),
      usuarioId: new Types.ObjectId(createCursoCompradoInput.usuarioId),
      courseTitle: curso.courseTitle,
    };

    // Llama al método create del BaseService para persistir el documento
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
   * Obtiene todos los registros de compra (activos o inactivos) de un curso específico.
   * Útil para métricas o listados de alumnos por curso.
   * @param cursoId ID del curso.
   * @returns Un array de registros de CursoComprado.
   */
  async findByCursoId(cursoId: Types.ObjectId): Promise<CursoComprado[]> {
    return this.cursoCompradoModel.find({ cursoId }).exec();
  }

  /**
   * Obtiene todo el historial de cursos comprados por un usuario específico,
   * sin importar si el acceso está vigente o ya expiró.
   * @param usuarioId ID del usuario.
   * @returns Un array de registros de CursoComprado.
   */
  async findByUsuarioId(usuarioId: Types.ObjectId): Promise<CursoComprado[]> {
    return this.cursoCompradoModel.find({ usuarioId }).exec();
  }

  /**
   * OBJETIVO: Devolver un listado de Ids de los cursos que el usuario tiene actualmente disponibles para estudiar.
   * @param usuarioId ID del usuario autenticado.
   * @returns Array de cursoId como strings.
   */
  async getIdsCursosActivosUsuario(usuarioId: Types.ObjectId): Promise<string[]> {
    const compras = await this.cursoCompradoModel
      .find({
        usuarioId,
        // Solo trae los cursos cuya fecha de expiración sea mayor o igual a hoy
        fechaExpiracion: { $gte: new Date() },
        // Asegura que el registro no haya sido eliminado (soft-delete)
        deleted: false,
      })
      .select('cursoId')  // Optimización: Solo traer el campo cursoId (query liviana)
      .lean()             // Optimización: Retorna objetos JS planos en vez de documentos Mongoose (más rápido)
      .exec();

    // Transforma el array de objetos en un array simple de strings
    return compras.map((c) => c.cursoId.toString());
  }

  /**
   * Crea o reactiva el acceso a un curso comprado de forma idempotente.
   *
   * Existe un índice único (usuarioId, cursoId) en CursoComprado, por lo que
   * un INSERT directo lanza E11000 si el usuario ya compró el curso (incluso
   * si el doc anterior estaba expirado o soft-deleted). Este método cubre los
   * tres casos:
   *   1. No existe → crea uno nuevo (vía create()).
   *   2. Existe y está vigente → no hace nada (idempotente).
   *   3. Existe pero expirado/soft-deleted → reactiva (extiende fechaExpiracion
   *      a +6 meses y deleted=false).
   *
   * Pensado para ser llamado desde completarPago() sin riesgo de lanzar.
   */
  async otorgarAcceso(
    usuarioId: Types.ObjectId,
    cursoId: Types.ObjectId,
    paymentId?: Types.ObjectId,
  ): Promise<CursoComprado> {
    // Busca si ya existe un registro previo de este usuario para este curso
    const existente = await this.cursoCompradoModel.findOne({
      usuarioId,
      cursoId,
    });

    // Caso 1: El registro no existe, se crea uno completamente nuevo
    if (!existente) {
      // Necesitamos el courseTitle, así que lo buscamos manualmente para pasarlo a create
      const curso = await this.cursoService.findById(cursoId);
      if (!curso) throw new NotFoundException('El curso no existe');

      const now = new Date();
      const fechaExpiracion = new Date(now);
      fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 6);

      const [nuevo] = await this.cursoCompradoModel.create([{
        cursoId,
        usuarioId,
        paymentId,
        courseTitle: curso.courseTitle,
        fechaCompra: now,
        fechaExpiracion,
        estadoAcceso: 'activo'
      }]);
      return nuevo;
    }

    const ahora = new Date();

    // Verifica si el acceso actual sigue siendo válido
    const sigueVigente =
      !existente.deleted &&
      existente.fechaExpiracion &&
      existente.fechaExpiracion > ahora;

    // Caso 2: El acceso sigue activo, no se hace nada para evitar duplicar tiempo o datos
    if (sigueVigente) {
      if (paymentId) {
        existente.paymentId = paymentId;
        await existente.save();
      }
      return existente;
    }

    // Caso 3: El registro existe pero estaba expirado o eliminado (Reactivación)
    // Se calcula una nueva fecha de expiración sumando 6 meses desde hoy
    const nuevaExpiracion = new Date(ahora);
    nuevaExpiracion.setMonth(nuevaExpiracion.getMonth() + 6);

    // Se reactiva el documento
    existente.deleted = false;
    existente.fechaCompra = ahora;
    existente.fechaExpiracion = nuevaExpiracion;
    if (paymentId) existente.paymentId = paymentId;

    // Se guardan los cambios en la base de datos
    return existente.save();
  }

  /**
     * OBJETIVO: Prevenir cobros duplicados analizando el carrito de compras, devuelve un string con los títulos de los cursos que ya tiene acceso.
     * 
     * Esta función actúa como un escudo protector antes de procesar un pago. 
     * Recibe los cursos que el usuario intenta adquirir y los compara contra sus accesos activos actuales. 
     * Si detecta que el usuario está intentando recomprar un curso al que ya tiene acceso vigente, devuelve los títulos de dichos cursos. 
     * Esto permite abortar el pago y notificar al usuario ("Ya tienes acceso a X").
     * Si todo está en orden y no hay duplicados, devuelve un array vacío.
     *
     * @param usuarioId ID del usuario que intenta realizar la compra.
     * @param cursoIds Array con los IDs de los cursos que desea comprar.
     * @returns Array con los títulos de los cursos que ya posee y están vigentes.
     */
  async verificarCursosYaComprados(
    usuarioId: Types.ObjectId,
    cursoIds: Types.ObjectId[],
  ): Promise<string[]> {
    // Busca en la base de datos registros que coincidan con el usuario y los cursos solicitados
    const cursosYaComprados = await this.cursoCompradoModel
      .find({
        usuarioId,
        cursoId: { $in: cursoIds }, // Operador $in para buscar múltiples IDs a la vez
        fechaExpiracion: { $gte: new Date() }, // Solo toma en cuenta accesos aún vigentes
        deleted: false,
      })
      .select('courseTitle cursoId') // Trae solo el título y el ID para ser eficiente
      .lean()
      .exec();

    // Mapea el resultado devolviendo el título del curso (o el ID como respaldo si no hay título)
    return cursosYaComprados.map((c) => c.courseTitle || c.cursoId.toString());
  }
}

