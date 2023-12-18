import { bootstrapLambda } from 'app/lambda';
import { ChimeService } from '../chime.service';
import { ChimeModule } from '../chime.module';

export const chimeService = async (): Promise<ChimeService> => {
  const app = await bootstrapLambda();
  const module = app.select(ChimeModule);
  return module.get(ChimeService, { strict: false });
};
