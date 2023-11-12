import { ConfigService } from '@nestjs/config';
import { UserSchema } from './user.schema';

export const UserModel = {
  name: 'User',
  useFactory: (_: any, configService: ConfigService) => {
    return {
      schema: UserSchema,
      options: {
        tableName: configService.get<string>('userTableId'),
      },
    };
  },
  inject: [ConfigService],
};
