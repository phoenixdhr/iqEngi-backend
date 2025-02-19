// orden/interfaces/orden.interface.ts

import { Types } from 'mongoose';

export interface IPost {
  _id: Types.ObjectId;

  tituloPost: string;

  description: string;

  autor: string;

  imageUrl: string;

  categoriaPost: string[];

  rating: number;

  isPublished: boolean;
}

export type IPostInput = Omit<IPost, '_id'>;
