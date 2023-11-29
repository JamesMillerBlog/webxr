import { checkSecretExists, deleteSecret, loadEnvVariables } from '../utils';

const attemptToDeleteSecret = (secretExists: boolean, secretName: string) => {
  if (secretExists) {
    console.log(`Deleting ${secretName}...`);
    deleteSecret(secretName);
    console.log(`${secretName} successfully deleted`);
    console.log('');
  }
};

console.log('Will now attempt to delete secrets');

const clientEnvs = loadEnvVariables('.env.client.local').parsed;
const serverEnvs = loadEnvVariables('.env.server.local').parsed;
const { STACK } = loadEnvVariables('.env.local').parsed;

const serverSecretName = `${serverEnvs.PROJECT_NAME}-server-${STACK}`;
const serverLocalSecretName = `${serverEnvs.PROJECT_NAME}-server-${STACK}-local`;
const clientSecretName = `${clientEnvs.NEXT_PUBLIC_PROJECT_NAME}-client-${STACK}`;
const clientLocalSecretName = `${clientEnvs.NEXT_PUBLIC_PROJECT_NAME}-client-${STACK}-local`;

const serverSecretExists = checkSecretExists(serverSecretName);
const serverLocalSecretExists = checkSecretExists(serverLocalSecretName);
const clientSecretExists = checkSecretExists(serverSecretName);
const clientLocalSecretExists = checkSecretExists(serverLocalSecretName);

attemptToDeleteSecret(serverSecretExists, serverSecretName);
attemptToDeleteSecret(serverLocalSecretExists, serverLocalSecretName);
attemptToDeleteSecret(clientLocalSecretExists, clientLocalSecretName);
attemptToDeleteSecret(clientSecretExists, clientSecretName);

console.log('');
console.log('');
