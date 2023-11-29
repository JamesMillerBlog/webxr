import * as fs from 'fs';
import { retrieveSecret } from '../utils';

// example usage:
// npm run scripts:setup whoa-client-dev-local . development.local

// Check if all required parameters are provided
if (process.argv.length !== 5) {
  console.error(
    'Usage: generateEnvFromSecret.ts <SECRET_NAME> <FILE_LOCATION> <ENV_FILE_NAME>',
  );
  process.exit(1);
}

// AWS Secret Name
const SECRET_NAME = process.argv[2];

// File location
const FILE_LOCATION = process.argv[3];

// Env file name
const ENV_FILE_NAME = process.argv[4];

const envFilePath = `${FILE_LOCATION}/.env.${ENV_FILE_NAME}`;
console.log(`Attempting to generate ${envFilePath} from ${SECRET_NAME}`);

const secrets = retrieveSecret(SECRET_NAME);
if (secrets) {
  // Extract values from SecretString dynamically
  const properties: string[] = [];
  for (const [key, value] of Object.entries(secrets)) {
    properties.push(`${key}=${value}`);
  }

  // Write to the environment file
  fs.writeFileSync(envFilePath, properties.join('\n'));

  console.log(
    `Environment file (${envFilePath}) has been created successfully.`,
  );
} else {
  console.error('No secrets available to generate env file.');
}
console.log('');
console.log('');
