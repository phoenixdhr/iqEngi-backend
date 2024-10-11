import { GoogleAuthGuard } from './google-auth.guard';

describe('GoogleOauthGuardGuard', () => {
  it('should be defined', () => {
    expect(new GoogleAuthGuard()).toBeDefined();
  });
});
