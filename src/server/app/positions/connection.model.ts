import { ConfigService } from '@nestjs/config';
import { ConnectionSchema } from 'app/positions/connection.schema';

export const ConnectionModel = {
  name: 'Connection',
  useFactory: (_: any, configService: ConfigService) => {
    return {
      schema: ConnectionSchema,
      options: {
        tableName: configService.get<string>('connectionsTableId'),
      },
    };
  },
  inject: [ConfigService],
};
