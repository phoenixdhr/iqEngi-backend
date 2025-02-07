import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IRespuestaData } from '../../interfaces/repuestaData.interface';

@InputType()
export class RespuestaDataInput implements IRespuestaData {
  @Field(() => ID)
  @IsMongoId()
  _id?: Types.ObjectId;

  @Field()
  @IsString()
  textOpcion: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  orden?: number;
}
