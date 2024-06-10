import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserPasswordDto } from 'src/usuarios/dtos/usuarios.dto';

import { UsuariosService } from 'src/usuarios/services/usuarios.service';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async validateUser(userPassword: UserPasswordDto): Promise<any> {
    const user = await this.usuariosService.findByEmail(userPassword.email);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const isPasswordValid = await bcrypt.compare(
      userPassword.password,
      user.hashPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashPassword, ...result } = user.toObject();
    return result;
  }
}
