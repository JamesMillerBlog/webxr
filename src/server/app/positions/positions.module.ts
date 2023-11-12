import { Module } from '@nestjs/common';
import { PositionsGateway } from './positions.gateway';
import { ConfigModule } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConnectionModel } from './connection.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamooseModule.forFeatureAsync([ConnectionModel]),
  ],
  controllers: [],
  providers: [PositionsGateway],
})
export class PositionsModule {}
