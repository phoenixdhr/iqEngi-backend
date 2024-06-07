import { Reflector } from '@nestjs/core';
import { ApiKeyGuard } from './api-key.guard';
describe('ApiKeyGuard', () => {
  it('should be defined', () => {
    return expect(
      new ApiKeyGuard(Reflect as unknown as Reflector),
    ).toBeDefined();
  });
});
