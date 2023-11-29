import { execSync } from 'child_process';
import { loadEnvVariables } from '../utils';
import { CLIENT_DIR, ENV_SCRIPTS, SERVER_DIR } from '../common/consts';

console.log('Now attempting to generate an env files from secrets');

// AWS Secret Name
const stack = process.argv[2];
if (!stack) {
  console.error(
    'NO ARGUMENT FOR INITIALISING THE STACK WAS PROVIDED (e.g dev)',
  );
}
const includePulumiSecrets = process.argv[3];

// File location
const clientEnvs = loadEnvVariables('.env.client.local').parsed;
const serverEnvs = loadEnvVariables('.env.server.local').parsed;

const formattedStackName =
  stack === 'dev' ? 'development' : stack === 'prod' ? 'production' : stack;

// Call the generate env script with parameters for server environment (manually configured)
execSync(
  `ts-node ${ENV_SCRIPTS}/generateEnvFromSecret.ts ${serverEnvs.PROJECT_NAME}-server-${stack}-local-test-2 ${SERVER_DIR} ${formattedStackName}.local`,
  { stdio: 'inherit' },
);

// Call the generate env script with parameters for client environment (manually configured)
execSync(
  `ts-node ${ENV_SCRIPTS}/generateEnvFromSecret.ts ${clientEnvs.NEXT_PUBLIC_PROJECT_NAME}-client-${stack}-local-test-2 ${CLIENT_DIR} ${formattedStackName}.local`,
  { stdio: 'inherit' },
);

if (includePulumiSecrets) {
  // Call the generate env script with parameters for server local environment (auto generated)
  execSync(
    `ts-node ${ENV_SCRIPTS}/generateEnvFromSecret.ts ${serverEnvs.PROJECT_NAME}-server-${stack}-test-2 ${SERVER_DIR} ${formattedStackName}`,
    { stdio: 'inherit' },
  );
  // Call the generate env script with parameters for client local environment (auto generated)
  execSync(
    `ts-node ${ENV_SCRIPTS}/generateEnvFromSecret.ts ${clientEnvs.NEXT_PUBLIC_PROJECT_NAME}-client-${stack}-test-2 ${CLIENT_DIR} ${formattedStackName}`,
    { stdio: 'inherit' },
  );
}

console.log('');
console.log('');
