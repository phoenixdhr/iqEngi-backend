import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/services/auth.service';
import { fieldAuth } from 'src/auth/models/variablesExport.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  'passport-local',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: fieldAuth.email,
      passwordField: fieldAuth.password,
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validatePassword({ email, password });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
