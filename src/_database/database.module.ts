import { Global, Module } from '@nestjs/common';
// import { MongoClient } from 'mongodb';
import configEnv from '../_common/configEnv';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configEnvService: ConfigType<typeof configEnv>) => {
        return {
          uri: configEnvService.mongo.uri,
          // user: configEnvService.mongo.user,
          // pass: configEnvService.mongo.password,
          // dbName: configEnvService.mongo.dbName,
        };
      },
      inject: [configEnv.KEY],
    }),
  ],
  // providers: [
  //   {
  //     provide: 'MONGO',
  //     useFactory: async (configEnvService: ConfigType<typeof configEnv>) => {
  //       const uri = configEnvService.mongo.uri;
  //       const dbName = configEnvService.mongo.dbName;

  //       const client = new MongoClient(uri);
  //       await client.connect();
  //       const database = client.db(dbName);
  //       return database;
  //     },
  //     inject: [configEnv.KEY],
  //   },
  // ],
  // exports: ['MONGO'],
})
export class DatabaseModule {}
