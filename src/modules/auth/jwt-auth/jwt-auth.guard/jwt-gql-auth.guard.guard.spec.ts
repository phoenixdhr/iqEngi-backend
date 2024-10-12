import { JwtGqlAuthGuard } from './jwt-auth.guard';

describe('JwtGqlAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtGqlAuthGuard()).toBeDefined();
  });
});
