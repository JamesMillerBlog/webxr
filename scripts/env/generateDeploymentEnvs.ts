import * as fs from 'fs';
import { generateEnvLocal, loadEnvVariables } from '../utils';
import { CLIENT_DIR, InfrastructureType, SERVER_DIR } from '../common';

const infType = process.argv[2];
if (!infType) {
  console.error(
    'NO ARGUMENT FOR WHICH PART OF THE INFRASTRUCTURE THAT WILL BE DEPLOYED',
  );
  process.exit(1);
}

if (
  infType !== InfrastructureType.SERVER &&
  infType !== InfrastructureType.CLIENT
) {
  console.error(
    'PROVIDED INFRASTRUCTURE TYPE NOT RECOGNISED, EXPECTED: "shared" / "client" / "server"',
  );
  process.exit(1);
}

loadEnvVariables('.env.local');
const stack = process.argv[3] ? process.argv[3] : process.env.STACK;
if (!stack) {
  console.error(
    'NO ARGUMENT OR ENV FOR INITIALISING THE STACK WAS PROVIDED (e.g dev)',
  );
  process.exit(1);
}

const formattedStackName =
  stack === 'dev' ? 'development' : stack === 'prod' ? 'production' : stack;

const dir = infType === InfrastructureType.CLIENT ? CLIENT_DIR : SERVER_DIR;

const envLocals = `${dir}/.env.${formattedStackName}.local`;
const envs = `${dir}/.env.${formattedStackName}`;

const requiredEnvFiles = [envLocals, envs];

for (const envFile of requiredEnvFiles) {
  if (!fs.existsSync(envFile)) {
    console.error(`Does not have required ${envFile} to start a deployment`);
    process.exit(1);
  }
}

generateEnvLocal(envLocals, envs, dir);

console.log('ENV FILES FOR DEPLOYMENT ARE READY');

console.log('');
console.log('');
