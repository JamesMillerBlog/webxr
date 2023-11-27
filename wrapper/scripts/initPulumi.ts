import { CLIENT_DIR, SCRIPTS_DIR, SERVER_DIR } from '../common/consts';
import {
  addToEnvFile,
  extractPulumiEnvs,
  loadEnvVariables,
  replacePulumiStackYaml,
  replacePulumiYaml,
} from '../utils';
import { execSync } from 'child_process';

console.log('Will now attempt to configure and initiate Pulumi.');

loadEnvVariables('.env.client.local');
loadEnvVariables('.env.server.local');
loadEnvVariables('.env.local');

const { projectName, domainName, awsRegion, stateBucket } =
  extractPulumiEnvs(true);

// Directory paths
const sharedInfraDir = 'src/shared/infrastructure';
const serverInfraDir = `${SERVER_DIR}/infrastructure`;
const clientInfraDir = `${CLIENT_DIR}/infrastructure`;
const stack = process.argv[2];

if (!stack) {
  console.error(
    'NO ARGUMENT FOR INITIALISING THE STACK WAS PROVIDED (e.g dev)',
  );
  process.exit(1);
}

if (!process.env.STACK) {
  addToEnvFile('.env.local', 'STACK', stack);
}

// Replace entire content of Pulumi.yaml and Pulumi.dev.yaml files and run pulumi login
replacePulumiYaml(
  sharedInfraDir,
  `${projectName}-shared`,
  stateBucket,
  'Cloud infrastructure shared across the stack',
);
replacePulumiStackYaml(
  sharedInfraDir,
  awsRegion,
  domainName,
  projectName,
  stack,
);

replacePulumiYaml(
  serverInfraDir,
  `${projectName}-server`,
  stateBucket,
  'Cloud infrastructure for the server stack',
);
replacePulumiStackYaml(
  serverInfraDir,
  awsRegion,
  domainName,
  projectName,
  stack,
);

replacePulumiYaml(
  clientInfraDir,
  `${projectName}-client`,
  stateBucket,
  'Cloud infrastructure for the client stack',
);
replacePulumiStackYaml(
  clientInfraDir,
  awsRegion,
  domainName,
  projectName,
  stack,
);

// Logs into the shared pulumi stack
execSync(`ts-node ${SCRIPTS_DIR}/pulumiStackLogin.ts shared`, {
  stdio: 'inherit',
});

console.log(
  'Pulumi.yaml and Pulumi.dev.yaml files replaced successfully and pulumi login completed.',
);
console.log('');
console.log('');
