import { JwtGqlAuthGuard } from './jwt-gql-auth.guard';

describe('JwtGqlAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtGqlAuthGuard()).toBeDefined();
  });
});
