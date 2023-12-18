import { execSync } from 'child_process';
import {
  checkPulumiConfigPassphraseExists,
  deleteS3Bucket,
  deleteSecret,
  loadEnvVariables,
} from './utils';

console.log(
  'YOU HAVE CALLED THE DELETION SCRIPT, THIS WILL ATTEMPT TO DELETE AN ENVIRONMENT',
);

console.log('');

loadEnvVariables('.env.client.local');
loadEnvVariables('.env.server.local');
loadEnvVariables('.env.local');

const pulumiConfigPassphraseExists = checkPulumiConfigPassphraseExists();
if (!pulumiConfigPassphraseExists) {
  console.error(
    'NO ENV FOR PULUMI_CONFIG_PASSPHRASE EXISTS, RUN THE BELOW COMMAND WITH YOUR OWN PULUMI PASSPHRASE',
  );
  console.log('');
  console.log('export PULUMI_CONFIG_PASSPHRASE=Test1234!');
  process.exit(1);
}

const projectName = process.argv[2] ?? process.env.PROJECT_NAME;
if (!projectName || projectName === 'undefined') {
  console.error('NO ARGUMENT FOR DELETING THE PROJECT NAME WAS PROVIDED');
  process.exit(1);
}

const stack = process.argv[3] ?? process.env.STACK;
if (!stack || stack === 'undefined') {
  console.error('NO ARGUMENT FOR DELETING THE STACK WAS PROVIDED (e.g dev)');
  process.exit(1);
}
console.log('');
console.log('');

execSync('yarn destroy:apps && yarn destroy:shared', {
  stdio: 'inherit',
});

const bucketToDelete = `${projectName}-pulumi-backend-state`;
deleteS3Bucket(bucketToDelete);

const clientSecretName = `${projectName}-client-dev-local`;
const serverSecretName = `${projectName}-server-dev-local`;

deleteSecret(clientSecretName);
deleteSecret(serverSecretName);
