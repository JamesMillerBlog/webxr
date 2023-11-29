import { CLIENT_DIR, InfrastructureType, SERVER_DIR } from '../common/consts';
import {
  extractPulumiEnvs,
  loadEnvVariables,
  pulumiLoginAndStackSelection,
} from '../utils';

loadEnvVariables('.env.client.local');
loadEnvVariables('.env.server.local');
loadEnvVariables('.env.local');

const { stateBucket, stack } = extractPulumiEnvs(false);

const infType = process.argv[2];
if (!infType) {
  console.error(
    'NO ARGUMENT FOR WHICH PART OF THE INFRASTRUCTURE THAT WILL BE DEPLOYED',
  );
  process.exit(1);
}

if (
  infType !== InfrastructureType.SHARED &&
  infType !== InfrastructureType.SERVER &&
  infType !== InfrastructureType.CLIENT
) {
  console.error(
    'PROVIDED INFRASTRUCTURE TYPE NOT RECOGNISED, EXPECTED: "shared" / "client" / "server"',
  );
  process.exit(1);
}

const stackArg = process.argv[3];

const selectedStack = stackArg ? stackArg : stack;
if (!selectedStack) {
  console.error(
    'NO ARGUMENT FOR INITIALISING THE STACK WAS PROVIDED (e.g dev)',
  );
  process.exit(1);
}

// Directory paths
const sharedInfraDir = 'src/shared/infrastructure';
const serverInfraDir = `${SERVER_DIR}/infrastructure`;
const clientInfraDir = `${CLIENT_DIR}/infrastructure`;

const dir =
  infType === InfrastructureType.SHARED
    ? sharedInfraDir
    : infType === InfrastructureType.SERVER
      ? serverInfraDir
      : clientInfraDir;

console.log(`ATTEMPTING TO LOG IN TO ${stateBucket}...`);

pulumiLoginAndStackSelection(stateBucket, selectedStack, dir);
