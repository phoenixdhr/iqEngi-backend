import { Args, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  @Query(() => String)
  helloWorld(): string {
    return 'Hello, World! xipi';
  }

  @Query(() => Int, {
    nullable: false,
    description: 'Generate a random number',
  })
  RamdomNumberTo(
    @Args('to', { type: () => Int, defaultValue: 10, nullable: true })
    to: number,
  ): number {
    return Math.floor(Math.random() * to);
  }
}
