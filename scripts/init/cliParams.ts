import {
  CLIENT_ENV_LOCALS,
  CLI_ARG,
  PROMPTS,
  SERVER_ENV_LOCALS,
} from '../common/consts';
import {
  validateDomain,
  validateReadyPlayerMeSubdomain,
  validateAwsRegion,
  validateNotBlank,
  createEnvFileIfNotExist,
  addToEnvFile,
} from '../utils';

const extractCliParam = (argIndex: number) => {
  const value = process.argv[argIndex];
  console.log(value);
  const property = PROMPTS[argIndex - 2];
  console.log(property);
  switch (argIndex) {
    case CLI_ARG.DOMAIN_NAME:
      validateDomain(value);
      break;
    case CLI_ARG.READY_PLAYER_ME_SUBDOMAIN:
      validateReadyPlayerMeSubdomain(value);
      break;
    case CLI_ARG.AWS_REGION:
      validateAwsRegion(value);
      break;
    default:
      validateNotBlank(value);
      break;
  }
  const shouldAddToClientEnv = CLIENT_ENV_LOCALS.includes(property);
  const shouldAddToServerEnv = SERVER_ENV_LOCALS.includes(property);
  if (shouldAddToClientEnv)
    addToEnvFile('.env.client.local', `NEXT_PUBLIC_${property}`, value);
  if (shouldAddToServerEnv) addToEnvFile('.env.server.local', property, value);
};

try {
  console.log('PARAMS PROVIDED, ATTEMPTING TO GENERATE ENV FILES');
  createEnvFileIfNotExist('.env.client.local');
  createEnvFileIfNotExist('.env.server.local');
  for (let x = 2; x < process.argv.length; x++) {
    console.log(x);
    extractCliParam(x);
  }
  console.log('.env.client.local and .server.local are successfully created');
  console.log('');
  console.log('');
} catch (e) {
  const error = String(e);
  console.error(`Error generating env variables: ${error}`);
  process.exit(1);
}
