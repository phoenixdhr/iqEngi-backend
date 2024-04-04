import { Global, Module } from '@nestjs/common';

const apiKey = '1234567890';

@Global()
@Module({
  providers: [
    {
      provide: 'API_CONFIG',
      useValue: {
        baseUrl: 'https://api.externa.com',
        apiKey: process.env.NODE_API_KEY ? process.env.NODE_API_KEY : apiKey,
      },
    },
  ],
  exports: ['API_CONFIG'],
})
export class DatabaseModule {}
