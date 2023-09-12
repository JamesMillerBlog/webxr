import { Module } from '@nestjs/common';
import { PositionsGateway } from './positions.gateway';

@Module({
  controllers: [],
  providers: [PositionsGateway],
})
export class PositionsModule {}
