import { execSync } from 'child_process';
import { SCRIPTS_DIR } from '../common/consts';
import { checkPulumiConfigPassphraseExists } from '../utils';

console.log(
  'YOU HAVE CALLED THE ENV GENERATION SCRIPT, THIS WILL ATTEMPT TO EXTRACT ENV VARIABLES FROM AN EXISTING PROJECTS SECRETS',
);

console.log('');
const pulumiConfigPassphraseExists = checkPulumiConfigPassphraseExists();
if (!pulumiConfigPassphraseExists) {
  console.error(
    'NO ENV FOR PULUMI_CONFIG_PASSPHRASE EXISTS, RUN THE BELOW COMMAND WITH YOUR OWN PULUMI PASSPHRASE',
  );
  console.log('');
  console.log('export PULUMI_CONFIG_PASSPHRASE=Test1234!');
  console.log('');
  console.log('^^ Be sure to replace Test1234! with your own passphrase ^^');
  process.exit(1);
}

const projectName = process.argv[2];
if (!projectName) {
  console.error('NO ARGUMENT FOR PROJECT NAME');
  process.exit(1);
}

const stack = process.argv[3];
if (!stack) {
  console.error('NO ARGUMENT FOR THE STACK (e.g dev)');
  process.exit(1);
}

console.log('');
console.log('');

execSync(`ts-node ${SCRIPTS_DIR}/pullStackEnvs.ts ${projectName} ${stack}`, {
  stdio: 'inherit',
});

execSync(`ts-node ${SCRIPTS_DIR}/generateEnvs.ts ${stack}`, {
  stdio: 'inherit',
});
