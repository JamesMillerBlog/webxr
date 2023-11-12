import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigModule } from '@nestjs/config';
import { UserModel } from './user.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamooseModule.forFeatureAsync([UserModel]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
