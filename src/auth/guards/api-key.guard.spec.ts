import { Reflector } from '@nestjs/core';
import { ApiKeyGuard } from './ApiKeyGuard';
describe('ApiKeyGuard', () => {
  it('should be defined', () => {
    return expect(
      new ApiKeyGuard(Reflect as unknown as Reflector),
    ).toBeDefined();
  });
});
