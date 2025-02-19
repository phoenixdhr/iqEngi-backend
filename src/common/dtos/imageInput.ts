import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUrl, IsString } from 'class-validator';
import { IImage } from '../interfaces/iImage';

@InputType()
export class ImageInput implements IImage {
  @Field()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  alt: string;
}
