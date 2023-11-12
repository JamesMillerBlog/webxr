import { bootstrapLambda } from 'app/lambda';
import { UserService } from '../user.service';
import { UserModule } from '../users.module';

export const userService = async (): Promise<UserService> => {
  const app = await bootstrapLambda();
  const module = app.select(UserModule);
  return module.get(UserService, { strict: false });
};

/*
  1. GET REST WORKING AND TEST WITH MAIN APP (post isn't working, is put somehow being triggered? check this)
  2. GET WS WORKING & TEST
  3. ADD AUTH (Use Guards for this?)
  4. SORT OUT GOBBLE
  5. Github CI

  Post-Push
  1. Graphql
  2. tidy state
*/
