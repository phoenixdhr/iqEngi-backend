// src/types/mongoose-delete.d.ts

import { Types } from 'mongoose';

declare module 'mongoose' {
  interface Document {
    delete: (deletedBy?: Types.ObjectId | string) => Promise<this>;
    restore: () => Promise<this>;
  }
}
