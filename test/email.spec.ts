import configEnv from 'src/common/enviroments/configEnv';
import { MailService } from 'src/modules/mail/mail.service';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';

const mockUser = {
  email: 'danyreyes209@hotmail.com',
  firstName: 'Dany',
} as Usuario;
const mockToken = 'dummy-token';

const mailService = new MailService(configEnv);

await mailService.sendVerificationEmail(mockUser, mockToken);
