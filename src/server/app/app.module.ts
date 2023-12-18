import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigModule } from '@nestjs/config';
import config from './common/config';
import { UserModule } from './users/users.module';
import { PositionsModule } from './positions/positions.module';
import { ChimeModule } from './chime/chime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        `.env.local`,
      ],
      isGlobal: true,
      load: [config],
    }),
    DynamooseModule.forRoot(),
    UserModule,
    PositionsModule,
    ChimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
