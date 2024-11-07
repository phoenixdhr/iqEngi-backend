import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @Inject(configEnv.KEY)
    private readonly configService: ConfigType<typeof configEnv>,
    private readonly mailService: MailService,
  ) {}

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
  ): Promise<Usuario[]> {
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
  async findByRol(rolesInput: RolesInput): Promise<Usuario[]> {
    // Asegúrate de que 'roles' es el campo correcto en tu esquema de Usuario
    return this.usuarioModel.find({ roles: { $in: rolesInput.roles } }).exec();
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id ID del usuario.
   * @returns El usuario encontrado.
   * @throws NotFoundException si el usuario no existe.
   */
  async findById(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

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

  /**
   * Actualiza los datos de un usuario por su ID (excluyendo la contraseña).
   * @param id ID del usuario a actualizar.
   * @param updateUsuarioInput Datos para actualizar el usuario.
   * @returns El usuario actualizado.
   * @throws NotFoundException si el usuario no existe.
   */
  async update(
    id: string,
    updateUsuarioInput: UpdateUsuarioInput,
    updatedBy: string,
  ): Promise<Usuario> {
    const updatedUsuario = await this.usuarioModel
      .findByIdAndUpdate(
        id,
        { ...updateUsuarioInput, updatedBy },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!updatedUsuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return updatedUsuario;
  }

  // /**
  //  * Actualiza la contraseña de un usuario.
  //  * @param id ID del usuario.
  //  * @param updatePasswordInput Datos para actualizar la contraseña.
  //  * @returns El usuario con la contraseña actualizada.
  //  * @throws NotFoundException si el usuario no existe.
  //  */
  // async updatePassword(
  //   id: string,
  //   updatePasswordInput: UpdatePasswordInput,
  // ): Promise<Usuario> {
  //   const { oldPassword, newPassword } = updatePasswordInput;

  //   const usuario = await this.usuarioModel.findById(id).exec();
  //   if (!usuario) {
  //     throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  //   }

  //   if (usuario.isGoogleAuth) {
  //     throw new ConflictException(
  //       'No puedes cambiar la contraseña de un usuario de Google, inicia sesión con tu cuenta de Google',
  //     );
  //   }

  //   // Verificar si la contraseña antigua es correcta
  //   const isOldPasswordValid = await bcrypt.compare(
  //     oldPassword,
  //     usuario.hashPassword,
  //   );
  //   if (!isOldPasswordValid) {
  //     throw new ConflictException('La contraseña antigua es incorrecta');
  //   }

  //   // Encriptar la nueva contraseña
  //   const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  //   // Actualizar la contraseña
  //   usuario.hashPassword = hashedNewPassword;
  //   await usuario.save();

  //   return usuario;
  // }

  /**
   * Elimina (desactiva) un usuario por su ID (soft delete).
   * @param idDelete ID del usuario a eliminar.
   * @returns El usuario eliminado.
   * @throws NotFoundException si el usuario no existe.
   */
  async softDelete(idDelete: string, idThanos: string): Promise<Usuario> {
    // Marcar el usuario como DELETED en lugar de eliminarlo físicamente
    const deletedUsuario = await this.usuarioModel
      .findByIdAndUpdate(
        idDelete,
        {
          status: UserStatus.DELETED,
          deletedAt: new Date(),
          deletedBy: idThanos,
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
   * Elimina un usuario de forma permanente por su ID (hard delete).
   * @param id ID del usuario a eliminar.
   * @returns El usuario eliminado.
   * @throws NotFoundException si el usuario no existe.
   */
  async hardDelete(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (usuario.status !== UserStatus.DELETED) {
      throw new ConflictException(
        'El usuario debe estar marcado como DELETED para eliminarlo permanentemente',
      );
    }

    const deletedUsuario = await this.usuarioModel.findByIdAndDelete(id).exec();
    return deletedUsuario;
  }

  /**
   * Elimina todos los usuarios marcados como DELETED.
   * @returns El número de usuarios eliminados.
   */
  async hardDeleteAllDeletedUsers(): Promise<number> {
    try {
      const result = await this.usuarioModel.deleteMany({
        status: UserStatus.DELETED,
      });
      return result.deletedCount || 0;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al eliminar usuarios eliminados',
        error.message,
      );
    }
  }

  /**
   * Obtiene todos los usuarios marcados como DELETED.
   * @returns Un array de usuarios eliminados.
   */
  async findSoftDeletedUsers(pagination?: PaginationArgs): Promise<Usuario[]> {
    const { limit = 10, offset = 0 } = pagination || {};

    try {
      return await this.usuarioModel
        .aggregate([
          { $match: { status: UserStatus.DELETED } },
          // Puedes agregar más etapas si necesitas
        ])
        .skip(offset)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener usuarios eliminados',
        error.message,
      );
    }
  }

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
}
