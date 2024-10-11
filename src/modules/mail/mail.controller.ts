import { Controller, Get, Post } from '@nestjs/common';
import { Usuario } from '../usuario/entities/usuario.entity';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail() {
    console.log('tuki1');
    const mockUser = {
      email: 'phoenixdhr@gmail.com',
      firstName: 'Dany',
    } as Usuario;
    const mockToken = 'dummy-token';
    console.log('tuki2');
    await this.mailService.sendVerificationEmail(mockUser, mockToken);
    return 'Email sent';
  }

  // @Post('tuki')
  @Get('tuki')
  async sendtuki() {
    console.log('tuki3');
    return 'tuki';
  }
}
