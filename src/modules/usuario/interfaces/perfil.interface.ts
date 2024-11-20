// usuario/interfaces/perfil.interface.ts

import { IdInterface } from 'src/common/interfaces/id.interface';

export interface IPerfil extends IdInterface {
  bio?: string;
  ubicacion?: string;
  celular?: string;
  fechaNacimiento?: Date;
  contacto?: string;
  intereses?: string[];
}

export type IPerfilInput = Omit<IPerfil, '_id'>;
