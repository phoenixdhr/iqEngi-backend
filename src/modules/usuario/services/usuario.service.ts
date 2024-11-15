import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Usuario } from '../entities/usuario.entity';
import * as jwt from 'jsonwebtoken';

import * as bcrypt from 'bcrypt';
import { UpdateUsuarioInput } from '../dtos/usuarios-dtos/update-usuario.input';
import { PaginationArgs, RolesInput, SearchArgs } from 'src/common/dtos';
import { UserStatus } from 'src/common/enums/estado-usuario.enum';
import { MailService } from 'src/modules/mail/mail.service';
import { UserRequest } from 'src/modules/auth/entities/user-request.entity';
import { UsuarioOutput } from '../dtos/usuarios-dtos/usuario.output';
import {
  CreateUserGoogleAuth,
  CreateUsuarioInput,
} from '../dtos/usuarios-dtos/create-usuario.input';
import configEnv from 'src/common/enviroments/configEnv';
import { ConfigType } from '@nestjs/config';
import { RolEnum } from 'src/common/enums';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UsuarioService extends BaseService<
  Usuario,
  UpdateUsuarioInput,
  CreateUsuarioInput
> {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @Inject(configEnv.KEY)
    private readonly configService: ConfigType<typeof configEnv>,
    private readonly mailService: MailService,
  ) {
    super(usuarioModel);
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * Envia un correo de verificación al usuario.
   * @param createUsuarioInput - Datos necesarios para crear el usuario, incluyendo email y contraseña.
   * @returns El usuario creado con los datos encriptados y otros detalles necesarios.
   * @throws ConflictException - Si el email ya está registrado en la base de datos.
   * @throws InternalServerErrorException - Si ocurre algún error durante la creación del usuario.
   */
  async create(createUsuarioInput: CreateUsuarioInput): Promise<UsuarioOutput> {
    const { email, password, ...rest } = createUsuarioInput;

    // Verificar si el email ya existe en la base de datos
    const existingUsuario = await this.usuarioModel.findOne({ email }).exec();
    if (existingUsuario) {
      throw new ConflictException(`El email ${email} ya está en uso`);
    }

    // Encriptar la contraseña antes de guardarla
    const hashPassword = await bcrypt.hash(password, 10);

    // Crear una nueva instancia del usuario con la contraseña encriptada y otros datos
    const newUsuario = new this.usuarioModel({
      email,
      hashPassword,
      ...rest,
    });

    try {
      // Guardar el usuario en la base de datos
      const savedUser = await newUsuario.save();

      // Crear un payload para el token de verificación
      const payload: UserRequest = {
        roles: savedUser.roles,
        sub: savedUser._id,
        email: savedUser.email,
      } as unknown as UserRequest;

      // Generar el token de verificación con un tiempo de expiración de 1 hora
      const verificationToken = jwt.sign(
        payload,
        this.configService.jwtSecret,
        {
          expiresIn: '1h',
        },
      );

      // Enviar correo electrónico de verificación con el token
      await this.mailService.sendVerificationEmail(
        savedUser,
        verificationToken,
      );

      // Retornar el usuario guardado como salida del método
      return savedUser;
    } catch (error) {
      // Manejar posibles errores durante la creación del usuario
      throw new InternalServerErrorException(
        'Error al crear el usuario',
        error.message,
      );
    }
  }

  /**
   * Crea un usuario a través de OAuth (e.g., Google).
   * @param createUserGoogleAuth Datos para crear el usuario vía OAuth.
   * @returns Usuario creado.
   */
  async createOAuthUserEstudiante(
    createUserGoogleAuth: CreateUserGoogleAuth,
  ): Promise<UsuarioOutput> {
    const { firstName, lastName, email, picture } = createUserGoogleAuth;

    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await this.usuarioModel.findOne({ email }).exec();

    if (existingUser) {
      // Si el usuario existe, actualiza los campos si son diferentes
      if (
        existingUser.firstName !== firstName ||
        existingUser.lastName !== lastName ||
        existingUser.picture !== picture
      ) {
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.picture = picture;
        return await existingUser.save();
      }

      // Si el usuario ya existe y no hay cambios, retorna el usuario existente
      return existingUser;
    }

    // Si el usuario no existe, crea un nuevo usuario con los datos proporcionados
    const newUser = new this.usuarioModel({
      firstName,
      lastName,
      picture,
      email,
      email_verified: true,
      status: UserStatus.ACTIVE,
      roles: [RolEnum.ESTUDIANTE],
      isGoogleAuth: true,
    });

    try {
      return await newUser.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al crear el usuario OAuth',
        error.message,
      );
    }
  }

  /**
   * Obtiene todos los usuarios con opciones de paginación y búsqueda.
   * @param pagination Opciones de paginación.
   * @param searchInput Opciones de búsqueda.
   * @returns Un array de usuarios.
   */
  async findAll(
    pagination?: PaginationArgs,
    searchInput?: SearchArgs,
  ): Promise<UsuarioOutput[]> {
    const { limit = 10, offset = 0 } = pagination || {};
    const { search } = searchInput || {};

    const query = search
      ? { firstName: { $regex: search, $options: 'i' } }
      : {};

    return this.usuarioModel.find(query).skip(offset).limit(limit).exec();
  }

  /**
   * Obtiene usuarios filtrados por roles específicos.
   * @param rolesInput Objeto que contiene los roles a filtrar.
   * @returns Un array de usuarios que tienen alguno de los roles especificados.
   */
  async findByRol(rolesInput: RolesInput): Promise<UsuarioOutput[]> {
    // Asegúrate de que 'roles' es el campo correcto en tu esquema de Usuario
    return this.usuarioModel.find({ roles: { $in: rolesInput.roles } }).exec();
  }

  // /**
  //  * Obtiene un usuario por su ID.
  //  * @param id ID del usuario.
  //  * @returns El usuario encontrado.
  //  * @throws NotFoundException si el usuario no existe.
  //  */
  // async findById(id: string): Promise<Usuario> {
  //   const usuario = await this.usuarioModel.findById(id).exec();
  //   if (!usuario) {
  //     throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  //   }
  //   return usuario;
  // }

  /**
   * Obtiene un usuario por su email.
   * @param email Email del usuario.
   * @returns El usuario encontrado.
   * @throws NotFoundException si el usuario no existe.
   */
  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findOne({ email }).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return usuario;
  }

  // /**
  //  * Actualiza los datos de un usuario por su ID (excluyendo la contraseña).
  //  * @param id ID del usuario a actualizar.
  //  * @param updateUsuarioInput Datos para actualizar el usuario.
  //  * @returns El usuario actualizado.
  //  * @throws NotFoundException si el usuario no existe.
  //  */
  // async update(
  //   id: string,
  //   updateUsuarioInput: UpdateUsuarioInput,
  //   idUpdatedBy: string,
  // ): Promise<UsuarioOutput> {
  //   const updatedUsuario = await this.usuarioModel
  //     .findByIdAndUpdate(
  //       id,
  //       { ...updateUsuarioInput, updatedBy: idUpdatedBy },
  //       {
  //         new: true,
  //         runValidators: true,
  //       },
  //     )
  //     .exec();

  //   if (!updatedUsuario) {
  //     throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  //   }

  //   return updatedUsuario;
  // }

  // #region Métodos de autenticación
  /**
   * Busca un usuario por su token de restablecimiento de contraseña.
   * @param hashedToken - El token hasheado.
   * @returns El usuario encontrado o null.
   */
  async findOneByResetToken(hashedToken: string): Promise<Usuario | null> {
    const user = await this.usuarioModel
      .findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      })
      .exec();

    if (!user) {
      return null;
    }
    return user;
  }

  // #region Manejo de eliminaciones
  /**
   * Elimina (desactiva) un usuario por su ID (soft delete).
   * @param idDelete ID del usuario a eliminar.
   * @param idThanos ID del usuario que realiza la eliminación.
   * @returns El usuario eliminado.
   * @throws NotFoundException si el usuario no existe.
   */
  async softDelete(idDelete: string, idThanos: string): Promise<UsuarioOutput> {
    // Marcar el usuario como DELETED y "deleted: true" en lugar de eliminarlo físicamente
    const deletedUsuario = await this.usuarioModel
      .findByIdAndUpdate(
        idDelete,
        {
          status: UserStatus.DELETED,
          deleted: true,
          deletedAt: new Date(),
          deletedBy: new Types.ObjectId(idThanos),
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!deletedUsuario) {
      throw new NotFoundException(`Usuario con ID ${idDelete} no encontrado`);
    }

    return deletedUsuario;
  }

  /**
   * Restaura un usuario eliminado.
   * @param id ID del usuario a restaurar.
   * @param userUpdatedId ID del usuario que realiza la restauración.
   * @returns El usuario restaurado.
   * @throws NotFoundException si el usuario no existe.
   */

  async restore(id: string, userUpdatedId): Promise<UsuarioOutput> {
    const restoredUsuario = await this.usuarioModel
      .findByIdAndUpdate(
        id,
        {
          status: UserStatus.ACTIVE,
          deleted: false,
          updatedBy: userUpdatedId,
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!restoredUsuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return restoredUsuario;
  }

  // /**
  //  * Elimina un usuario de forma permanente por su ID (hard delete).
  //  * @param id ID del usuario a eliminar.
  //  * @returns El usuario eliminado.
  //  * @throws NotFoundException si el usuario no existe.
  //  */
  // async hardDelete(id: string): Promise<UsuarioOutput> {
  //   const usuario = await this.usuarioModel.findById(id).exec();
  //   if (!usuario) {
  //     throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  //   }

  //   if (usuario.deleted !== true) {
  //     throw new ConflictException(
  //       'El usuario debe estar marcado con "status:DELETED" y "deleted:true" para eliminarlo permanentemente',
  //     );
  //   }

  //   const deletedUsuario = await this.usuarioModel.findByIdAndDelete(id).exec();
  //   return deletedUsuario;
  // }

  // /**
  //  * Elimina todos los usuarios marcados como "deleted: true".
  //  * @returns El número de usuarios eliminados.
  //  */
  // async hardDeleteAllSoftDeleted(): Promise<{ deletedCount: number }> {
  //   try {
  //     const result = await this.usuarioModel.deleteMany({
  //       deleted: true,
  //     });
  //     return { deletedCount: result.deletedCount };
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Error al eliminar usuarios permanentemente',
  //       error.message,
  //     );
  //   }
  // }

  // /**
  //  * Obtiene todos los usuarios marcados como "deleted: true".
  //  * @returns Un array de usuarios eliminados.
  //  */
  // async findSoftDeleted(pagination?: PaginationArgs): Promise<UsuarioOutput[]> {
  //   const { limit = 10, offset = 0 } = pagination || {};

  //   try {
  //     return await this.usuarioModel
  //       .find({ deleted: true })
  //       .skip(offset)
  //       .limit(limit)
  //       .exec();
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Error al obtener usuarios eliminados',
  //       error.message,
  //     );
  //   }
  // }
}
