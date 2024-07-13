import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckGoogleTokenExpiryGuard } from './check-google-token.guard';
import { AuthService } from 'src/auth/services/auth.service';

describe('CheckTokenExpiryGuard', () => {
  let guard: CheckGoogleTokenExpiryGuard;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckGoogleTokenExpiryGuard,
        {
          provide: AuthService,
          useValue: {
            isTokenExpired: jest.fn(),
            getNewAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<CheckGoogleTokenExpiryGuard>(CheckGoogleTokenExpiryGuard);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if access token is not found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {},
        }),
      }),
    } as any as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if refresh token is not found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { access_token: 'valid-access-token' },
        }),
        getResponse: () => ({
          cookie: jest.fn(),
        }),
      }),
    } as any as ExecutionContext;

    jest.spyOn(authService, 'isTokenExpired').mockResolvedValue(true);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should set new access token if access token is expired', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            access_token: 'expired-access-token',
            refresh_token: 'valid-refresh-token',
          },
        }),
        getResponse: () => ({
          cookie: jest.fn(),
        }),
      }),
    } as any as ExecutionContext;

    jest.spyOn(authService, 'isTokenExpired').mockResolvedValue(true);
    jest
      .spyOn(authService, 'getNewAccessToken')
      .mockResolvedValue('new-access-token');

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(context.switchToHttp().getResponse().cookie).toHaveBeenCalledWith(
      'access_token',
      'new-access-token',
      { httpOnly: true },
    );
    expect(context.switchToHttp().getRequest().cookies['access_token']).toBe(
      'new-access-token',
    );
  });

  it('should allow access if access token is valid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { access_token: 'valid-access-token' },
        }),
      }),
    } as any as ExecutionContext;

    jest.spyOn(authService, 'isTokenExpired').mockResolvedValue(false);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });
});
