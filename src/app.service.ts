import { Injectable, Inject } from '@nestjs/common';
// import { ConfigType } from '@nestjs/config';
import configEnv from './_common/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @Inject(configEnv.KEY) private configService: ConfigType<typeof configEnv>,
  ) {}
  getHello(): string {
    const apiKey = this.configService.apiKey;
    const dataBase = this.configService.database.name;
    return `Hello World! la url del baseApi es: ${dataBase} Y la apiKey es: ${apiKey}`;
  }
}
