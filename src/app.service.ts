import { Injectable, Inject } from '@nestjs/common';
import configEnv from './_common/configEnv';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @Inject(configEnv.KEY) private configService: ConfigType<typeof configEnv>,
  ) {}
  async getHello() {
    const cursos = 'dcdc';
    return `Hello World! la url del baseApi es: ${cursos}`;
  }
}
