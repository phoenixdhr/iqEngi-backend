import { Types } from 'mongoose';

export type IdBaseIdInterface<IdKey extends string = '_id'> = {
  [K in IdKey]: Types.ObjectId;
} & { deleted?: boolean };
