import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigModule } from '@nestjs/config';
import config from './common/config';
import { UserModule } from './users/users.module';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}.local`],
      isGlobal: true,
      load: [config],
    }),
    DynamooseModule.forRoot(),
    UserModule,
    PositionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
