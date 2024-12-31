// import { ObjectType, OmitType } from '@nestjs/graphql';
// import { Opcion } from '../../entities/opcion.entity';

// // #region Opcion
// @ObjectType()
// export class OpcionOutput extends OmitType(Opcion, [
//   'deleted',
//   'esCorrecta',
// ] as const) {}

import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { IOpcion } from '../../../cuestionario/interfaces/opcion.interface';

@ObjectType()
export class OpcionOutput implements IOpcion {
  @Field(() => ID, { nullable: true })
  _id: Types.ObjectId; // Ojo: _id en Mongoose se genera automático,
  // pero en GraphQL así lo haces opcional

  @Field({ nullable: true })
  @Prop({ required: false }) // o simplemente @Prop()
  textOpcion: string;

  @Field(() => Int, { nullable: true })
  @Prop({ required: false })
  orden?: number;
}
