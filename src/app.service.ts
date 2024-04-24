import { Injectable, Inject } from '@nestjs/common';
// import { ConfigType } from '@nestjs/config';
import configEnv from './_common/configEnv';
import { ConfigType } from '@nestjs/config';
// import { Db } from 'mongodb';

@Injectable()
export class AppService {
  constructor(
    @Inject(configEnv.KEY) private configService: ConfigType<typeof configEnv>,
    // @Inject('MONGO') private database: Db,
  ) {}
  async getHello() {
    // const cursoCollection = this.database.collection('cursos');
    // const cursos = cursoCollection.find().toArray();
    const cursos = 'dcdc';
    return `Hello World! la url del baseApi es: ${cursos}`;
  }

  // getCurso() {
  //   const cursoCollection = this.database.collection('cursos');
  //   const cursos = cursoCollection.find().toArray();
  //   return cursos;
  // }
}
