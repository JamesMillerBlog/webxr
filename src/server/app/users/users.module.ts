import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DynamooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: (_, configService: ConfigService) => {
          return {
            schema: UserSchema,
            options: {
              tableName: configService.get<string>('userTableId'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
