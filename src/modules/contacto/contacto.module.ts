import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';
import { Contacto, ContactoSchema } from './entities/contacto.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contacto.name, schema: ContactoSchema },
    ]),
  ],
  providers: [ContactoService],
  controllers: [ContactoController],
  exports: [ContactoService],
})
export class ContactoModule {}
