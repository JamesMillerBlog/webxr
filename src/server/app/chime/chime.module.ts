import { Module } from '@nestjs/common';
import { ChimeService } from './chime.service';
import { ChimeController } from './chime.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigModule } from '@nestjs/config';
import { ChimeModel } from './chime.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamooseModule.forFeatureAsync([ChimeModel]),
  ],
  controllers: [ChimeController],
  providers: [ChimeService],
})
export class ChimeModule {}
