import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { fieldAuth } from '../../dtos/variablesExport.model';
import { JwtAuthService } from '../jwt-auth.service';
import { UserRequest } from '../../entities/user-request.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private JwtAuthService: JwtAuthService) {
    super({
      usernameField: fieldAuth.email,
      passwordField: fieldAuth.password,
    });
  }
  async validate(email: string, password: string): Promise<UserRequest> {
    console.log('user111111111');
    const user = await this.JwtAuthService.validatePassword({
      email,
      password,
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }
}
