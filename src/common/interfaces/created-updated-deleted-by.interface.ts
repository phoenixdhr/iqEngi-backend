import { Types } from 'mongoose';

export interface CreatedUpdatedDeletedBy {
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  deleted: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}
