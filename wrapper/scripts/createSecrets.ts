import { checkSecretExists, createSecret, loadEnvVariables } from '../utils';

console.log(
  'Will now attempt to create/update secrets used to store your config',
);

const clientEnvs = loadEnvVariables('.env.client.local').parsed;
const serverEnvs = loadEnvVariables('.env.server.local').parsed;
const { STACK } = loadEnvVariables('.env.local').parsed;

const serverSecretName = `${serverEnvs.PROJECT_NAME}-server-${STACK}-local-test-2`;
const clientSecretName = `${clientEnvs.NEXT_PUBLIC_PROJECT_NAME}-client-${STACK}-local-test-2`;

const serverSecretExists = checkSecretExists(serverSecretName);
const clientSecretExists = checkSecretExists(serverSecretName);

if (!serverSecretExists) {
  console.log(`Creating ${serverSecretName}...`);
  createSecret(serverSecretName, serverEnvs, serverEnvs.AWS_REGION);
  console.log(`${serverSecretName} successfully created`);
  console.log('');
}

if (!clientSecretExists) {
  console.log(`Creating ${clientSecretName}...`);
  createSecret(clientSecretName, clientEnvs, clientEnvs.NEXT_PUBLIC_AWS_REGION);
  console.log(`${clientSecretName} successfully created`);
}

console.log('');
console.log('');
