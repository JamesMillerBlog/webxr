import { execSync } from 'child_process';
import {
  AWS_SCRIPTS,
  ENV_SCRIPTS,
  INIT_SCRIPTS,
  PULUMI_SCRIPTS,
} from './common';
import { checkPulumiConfigPassphraseExists } from './utils';

console.log(
  'YOU HAVE CALLED THE SETUP SCRIPT, THIS WILL ATTEMPT TO SETUP NEW ENVIRONMENT',
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

const stack = process.argv[2];
if (!stack) {
  console.error(
    'NO ARGUMENT FOR INITIALISING THE STACK WAS PROVIDED (e.g dev)',
  );
  process.exit(1);
}

console.log('');
console.log('');
// either extracts params from cli args, or prompts user for their manual configurations and generate .env.client.local and .env.server.local files
execSync(
  `ts-node ${INIT_SCRIPTS}/generateLocals.ts ${process.argv[3]} ${process.argv[4]} ${process.argv[5]} ${process.argv[6]}`,
  { stdio: 'inherit' },
);
// create state buckets based on the project name and create .env.local for these bucket names
execSync(`ts-node ${AWS_SCRIPTS}/s3StateBucketsSetup.ts`, { stdio: 'inherit' });
// create pulumi config files using the .env* variables, then initiate pulumi with these config files and update .env.local with the chosen stack
execSync(`ts-node ${PULUMI_SCRIPTS}/initPulumi.ts ${stack}`, {
  stdio: 'inherit',
});
// create secrets for these manual configurations, using the information in all created .env* files
execSync(`ts-node ${AWS_SCRIPTS}/createSecrets.ts`, { stdio: 'inherit' });
// generate the appropriate .env* files for the server and client directories
execSync(`ts-node ${ENV_SCRIPTS}/generateEnvs.ts ${stack}`, {
  stdio: 'inherit',
});
// run pulumi script to deploy shared resources
execSync(`yarn deploy:shared`, { stdio: 'inherit' });

// format env name for nextjs and nestjs
const formattedStackName =
  stack === 'dev' ? 'development' : stack === 'prod' ? 'production' : stack;

execSync(`ts-node ${ENV_SCRIPTS}/generateEnvs.ts ${stack} true`, {
  stdio: 'inherit',
});

execSync(
  `ts-node ${ENV_SCRIPTS}/generateDeploymentEnvs.ts client ${formattedStackName}`,
  { stdio: 'inherit' },
);

execSync(
  `ts-node ${ENV_SCRIPTS}/generateDeploymentEnvs.ts server ${formattedStackName}`,
  { stdio: 'inherit' },
);

if (process.argv[3] !== 'localhost-project-init') {
  execSync(`yarn deploy:client`, { stdio: 'inherit' });
  execSync(`yarn deploy:server`, { stdio: 'inherit' });
}
