import { execSync } from 'child_process';
import {
  checkPulumiConfigPassphraseExists,
  deleteS3Bucket,
  deleteSecret,
} from './utils';

console.log(
  'YOU HAVE CALLED THE DELETION SCRIPT, THIS WILL ATTEMPT TO DELETE AN ENVIRONMENT',
);

console.log('');
const pulumiConfigPassphraseExists = checkPulumiConfigPassphraseExists();
if (!pulumiConfigPassphraseExists) {
  console.error(
    'NO ENV FOR PULUMI_CONFIG_PASSPHRASE EXISTS, RUN THE BELOW COMMAND WITH YOUR OWN PULUMI PASSPHRASE',
  );
  console.log('');
  console.log('export PULUMI_CONFIG_PASSPHRASE=Test1234!');
  process.exit(1);
}

const projectName = process.argv[2];
if (!projectName) {
  console.error('NO ARGUMENT FOR DELETING THE PROJECT NAME WAS PROVIDED');
  process.exit(1);
}

const stack = process.argv[3];
if (!stack) {
  console.error('NO ARGUMENT FOR DELETING THE STACK WAS PROVIDED (e.g dev)');
  process.exit(1);
}
console.log('');
console.log('');

execSync('yarn destroy:client-and-server && yarn destroy:shared', {
  stdio: 'inherit',
});

const bucketToDelete = `${projectName}-pulumi-backend-state`;
deleteS3Bucket(bucketToDelete);

const clientSecretName = `${projectName}-client-dev-local`;
const serverSecretName = `${projectName}-server-dev-local`;

deleteSecret(clientSecretName);
deleteSecret(serverSecretName);
