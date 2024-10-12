import { forwardRef, Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [forwardRef(() => UsuarioModule)],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
