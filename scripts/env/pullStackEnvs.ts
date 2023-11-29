import { ENV_SCRIPTS } from '../common/consts';
import { createEnvFileIfNotExist, addToEnvFile } from '../utils';
import { execSync } from 'child_process';

try {
  console.log('PARAMS PROVIDED, ATTEMPTING TO GENERATE ENV FILES');
  createEnvFileIfNotExist('.env.client.local');
  createEnvFileIfNotExist('.env.server.local');
  createEnvFileIfNotExist('.env.local');

  const projectName = process.argv[2];
  const stack = process.argv[3];

  addToEnvFile('.env.client.local', `NEXT_PUBLIC_PROJECT_NAME`, projectName);
  addToEnvFile('.env.server.local', 'PROJECT_NAME', projectName);
  addToEnvFile('.env.local', 'STACK', stack);
  addToEnvFile(
    '.env.local',
    'STATE_BUCKET',
    `${projectName}-pulumi-backend-state`,
  );

  console.log(
    '.env.local, .env.client.local, .server.local are successfully created',
  );
  console.log('');
  console.log('');

  execSync(`ts-node ${ENV_SCRIPTS}/generateEnvs.ts ${stack} true`, {
    stdio: 'inherit',
  });
} catch (e) {
  const error = String(e);
  console.error(`Error generating env variables: ${error}`);
  process.exit(1);
}
