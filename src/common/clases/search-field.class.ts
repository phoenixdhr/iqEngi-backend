// @ArgsType()
export default class SearchField<T> {
  // @Field(() => String, { nullable: true })
  // @IsOptional()
  // @IsString()
  field: keyof T & string;
}
