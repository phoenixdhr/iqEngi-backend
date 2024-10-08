import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from '../entities/usuario.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuariosModel: Model<Usuario>,
  ) {}
}
