import { Global, Module } from '@nestjs/common';
// import { MongoClient } from 'mongodb';
import configEnv from '../common/enviroments/configEnv';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configEnvService: ConfigType<typeof configEnv>) => {
        return {
          uri: configEnvService.mongo.uri,
          dbName: configEnvService.mongo.dbName,
        };
      },
      inject: [configEnv.KEY],
    }),
  ],
})
export class DatabaseModule {}
