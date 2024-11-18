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
import { PaginationArgs, RolesInput, SearchTextArgs } from 'src/common/dtos';
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
import { ReturnDocument } from 'mongodb';
import SearchField from 'src/common/clases/search-field.class';

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
    searchInput?: SearchTextArgs,
  ): Promise<UsuarioOutput[]> {
    const { limit = 10, offset = 0 } = pagination || {};
    const { search } = searchInput || {};

    const query = search
      ? { firstName: { $regex: search, $options: 'i' } }
      : {};

    return this.usuarioModel.find(query).skip(offset).limit(limit).exec();
  }

  /**
   * Obtiene todos los usuarios que coinsidan un un texto, funcion contiene opciones de paginación.
   * @param searchArgs Objeto que contiene un campo "serch" (texto que se usará para realizar busquedas).
   * @param pagination Opciones de paginación.
   * @returns Un array de usuarios.
   *
   * @Roles: ADMINISTRADOR, SUPERADMIN
   */
  async findAllByFirstname(
    searchArgs: SearchTextArgs,
    pagination: PaginationArgs,
  ): Promise<UsuarioOutput[]> {
    const searchField: SearchField<UsuarioOutput> = new SearchField();
    searchField.field = 'firstName';

    return super.findAllBy(searchArgs, searchField, pagination) as Promise<
      UsuarioOutput[]
    >;
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
      throw new NotFoundException(
        `Usuario con ID ${idDelete} no encontrado, o tal vez haya sido eliminado`,
      );
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

  async restore(id: string, userUpdatedId: string): Promise<UsuarioOutput> {
    // Convertir el id a ObjectId si es necesario
    const idRestore = new Types.ObjectId(id);
    const updatedBy = new Types.ObjectId(userUpdatedId);

    try {
      // Usar collection.findOneAndUpdate para bypassar el middleware de Mongoose
      const usuario = await this.usuarioModel.collection.findOne({
        _id: idRestore,
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      if (!usuario.deleted) {
        throw new NotFoundException(
          `Usuario con ID ${id} no está eliminado, no es necesario restaurarlo`,
        );
      }

      const updateUsuario = await this.usuarioModel.collection.findOneAndUpdate(
        { _id: idRestore, deleted: true }, // Condición: buscar el usuario con el ID y que esté eliminado
        {
          $set: {
            status: UserStatus.ACTIVE,
            deleted: false,
            updatedBy: updatedBy,
          },
        },
        {
          returnDocument: ReturnDocument.AFTER, // Retorna el documento después de la actualización
        },
      );

      const restoredUsuario = updateUsuario as UsuarioOutput;

      return restoredUsuario;
    } catch (error) {
      // // Manejo de errores más detallado
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al restaurar el usuario',
        error.message,
      );
    }
  }

  // #region Métodos de autenticación
  /**
   * Busca un usuario por su token de restablecimiento de contraseña.
   * @param hashedToken - El token hasheado.
   * @returns El usuario encontrado o null.
   */
  async _findOneByResetToken(hashedToken: string): Promise<Usuario | null> {
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
