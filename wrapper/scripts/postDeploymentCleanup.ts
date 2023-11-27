import { CLIENT_DIR, InfrastructureType, SERVER_DIR } from '../common/consts';
import { deleteEnv } from '../utils';

const infType = process.argv[2];
if (!infType) {
  console.error('NO ARGUMENT FOR INFRASTRUCTURE TYPE WAS PROVIDED');
  process.exit(1);
}

if (
  infType !== InfrastructureType.SERVER &&
  infType !== InfrastructureType.CLIENT
) {
  console.error(
    'PROVIDED INFRASTRUCTURE TYPE NOT RECOGNISED, EXPECTED: "client" / "server"',
  );
  process.exit(1);
}

const clientDeploymentEnv = `${CLIENT_DIR}/.env.local`;
const serverDeploymentEnv = `${SERVER_DIR}/.env.local`;

const deploymentEnv =
  infType === InfrastructureType.SERVER
    ? serverDeploymentEnv
    : clientDeploymentEnv;

deleteEnv(deploymentEnv);
