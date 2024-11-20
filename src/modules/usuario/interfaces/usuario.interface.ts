// usuario/interfaces/usuario.interface.ts

import { RolEnum } from 'src/common/enums/rol.enum';
import { IPerfilInput } from './perfil.interface';
import { Types } from 'mongoose';
import { UserAuth } from 'src/modules/auth/interfaces/google-user.interface';
import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IUsuario extends UserAuth, IdInterface {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  email_verified?: boolean;
  hashPassword?: string;
  isGoogleAuth?: boolean;
  roles?: RolEnum[];
  picture?: string;
  perfil?: IPerfilInput; // Reemplaza con IPerfil si está definido
  notificaciones: boolean;
  cursosFavoritos?: Types.ObjectId[];
}

export type IUsuarioInput = Omit<IUsuario, '_id'>;
