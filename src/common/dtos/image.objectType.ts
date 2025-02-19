import { ObjectType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUrl, IsString } from 'class-validator';
import { IImage } from '../interfaces/iImage';

@ObjectType()
export class ImageObjectType implements IImage {
  @Field()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  alt: string;
}
