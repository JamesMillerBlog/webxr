import { execSync } from 'child_process';
import { INIT_SCRIPTS } from '../common/consts';

// Check if all required parameters are provided
if (process.argv.length === 6) {
  const domainName = process.argv[2];
  const projectName = process.argv[3];
  const awsRegion = process.argv[4];
  const readyPlayerMeSubdomain = process.argv[5];

  // prompt user for their manual configurations and generate .env.client.local and .env.server.local files
  execSync(
    `ts-node ${INIT_SCRIPTS}/cliParams.ts ${domainName} ${projectName} ${awsRegion} ${readyPlayerMeSubdomain}`,
    { stdio: 'inherit' },
  );
} else {
  // prompt user for their manual configurations and generate .env.client.local and .env.server.local files
  execSync(`ts-node ${INIT_SCRIPTS}/prompts.ts`, { stdio: 'inherit' });
}
