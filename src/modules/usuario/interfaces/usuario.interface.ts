// usuario/interfaces/usuario.interface.ts

import { RolEnum } from 'src/common/enums/rol.enum';
import { IPerfil } from './perfil.interface';
import { Types } from 'mongoose';
import { UserAuth } from 'src/modules/auth/interfaces/google-user.interface';

export interface IUsuario extends UserAuth {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  email_verified?: boolean;
  hashPassword?: string;
  isGoogleAuth?: boolean;
  roles?: RolEnum[];
  picture?: string;
  perfil?: IPerfil; // Reemplaza con IPerfil si está definido
  notificaciones: boolean;
}

export type IUsuarioInput = Omit<IUsuario, '_id'>;
