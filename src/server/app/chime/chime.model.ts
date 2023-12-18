import { ConfigService } from '@nestjs/config';
import { ChimeSchema } from './chime.schema';

export const ChimeModel = {
  name: 'Chime',
  useFactory: (_: any, configService: ConfigService) => {
    return {
      schema: ChimeSchema,
      options: {
        tableName: configService.get<string>('chimeTableId'),
      },
    };
  },
  inject: [ConfigService],
};
