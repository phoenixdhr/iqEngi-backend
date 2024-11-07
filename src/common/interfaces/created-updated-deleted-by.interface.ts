import { Types } from 'mongoose';
import { UserStatus } from '../enums/estado-usuario.enum';
import { DocumentStatus } from '../enums/estado-documento';

export interface CreatedUpdatedDeletedBy {
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
  status: UserStatus | DocumentStatus;
}
