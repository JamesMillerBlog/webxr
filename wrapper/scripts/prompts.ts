import * as readline from 'readline';
import {
  validateDomain,
  validateReadyPlayerMeSubdomain,
  validateAwsRegion,
  validateNotBlank,
  createEnvFileIfNotExist,
  addToEnvFile,
} from '../utils';
import {
  CLIENT_ENV_LOCALS,
  PROMPTS,
  SERVER_ENV_LOCALS,
} from '../common/consts';

// Create an interface to read from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = (index: number) => {
  if (index < PROMPTS.length) {
    const variable = PROMPTS[index];

    rl.question(`Enter ${variable}: `, (value) => {
      switch (variable) {
        case 'DOMAIN_NAME':
          validateDomain(value);
          break;
        case 'READY_PLAYER_ME_SUBDOMAIN':
          validateReadyPlayerMeSubdomain(value);
          break;
        case 'AWS_REGION':
          validateAwsRegion(value);
          break;
        default:
          validateNotBlank(value);
          break;
      }

      const shouldAddToClientEnv = CLIENT_ENV_LOCALS.includes(variable);
      const shouldAddToServerEnv = SERVER_ENV_LOCALS.includes(variable);

      if (shouldAddToClientEnv)
        addToEnvFile('.env.client.local', `NEXT_PUBLIC_${variable}`, value);
      if (shouldAddToServerEnv)
        addToEnvFile('.env.server.local', variable, value);

      // Continue prompting for the next variable
      promptUser(index + 1);
    });
  } else {
    // Close the interface after processing all variables
    rl.close();
  }
};

// Display usage notes
console.log(
  'You will now be prompted to provide information to setup your new environment:',
);

console.log('');

createEnvFileIfNotExist('.env.client.local');
createEnvFileIfNotExist('.env.server.local');

// Start the prompt by calling the recursive function with index 0
promptUser(0);
