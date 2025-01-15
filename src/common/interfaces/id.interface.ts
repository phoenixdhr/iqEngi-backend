// comentario/interfaces/comentario.interface.ts

import { Types } from 'mongoose';

export interface IdInterface {
  _id: Types.ObjectId;
  deleted?: boolean;
  deletedBy?: Types.ObjectId;
}
