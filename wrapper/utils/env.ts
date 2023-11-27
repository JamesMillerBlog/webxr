import * as fs from 'fs';

export const createEnvFileIfNotExist = (envFile: string) => {
  if (!fs.existsSync(envFile)) {
    console.log(`${envFile} file not found. Creating a new one.`);
    fs.writeFileSync(envFile, '');
  } else {
    console.log(`${envFile} file already exists.`);
  }
};

export const addToEnvFile = (
  envFile: string,
  variable: string,
  value: string,
) => {
  // Add or update the variable in the specified environment file
  if (
    fs.existsSync(envFile) &&
    fs.readFileSync(envFile, 'utf-8').includes(`${variable}=`)
  ) {
    // Update the existing variable
    const fileContent = fs.readFileSync(envFile, 'utf-8');
    const updatedContent = fileContent.replace(
      new RegExp(`^${variable}=.*$`, 'm'),
      `${variable}=${value}`,
    );
    fs.writeFileSync(envFile, updatedContent);
  } else {
    // Add the new variable
    fs.appendFileSync(envFile, `${variable}=${value}\n`);
  }
};

export const loadEnvVariables = (envFile: string) => {
  if (fs.existsSync(envFile)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('dotenv').config({ path: envFile });
  } else {
    console.error(`Error: ${envFile} file not found.`);
    process.exit(1);
  }
};

export const generateEnvLocal = (
  envLocalPath: string,
  envPath: string,
  dir: string,
) => {
  const envs = {
    ...loadEnvVariables(envLocalPath).parsed,
    ...loadEnvVariables(envPath).parsed,
  };

  // Extract values from SecretString dynamically
  const properties: string[] = [];
  for (const [key, value] of Object.entries(envs)) {
    properties.push(`${key}=${value}`);
  }

  fs.writeFileSync(`${dir}/.env.local`, properties.join('\n'));
  console.log(`Successfully created ${`${dir}/.env.local`}`);
  console.log('');
};

export const checkPulumiConfigPassphraseExists = () => {
  if (process.env.PULUMI_CONFIG_PASSPHRASE) {
    console.log('PULUMI_CONFIG_PASSPHRASE is exported.');
    console.log('');
    return true;
  } else {
    console.log('PULUMI_CONFIG_PASSPHRASE is not exported.');
    console.log('');
    return false;
  }
};

export const deleteEnv = (envFile: string) => {
  // Check if the file exists before attempting to delete it
  if (fs.existsSync(envFile)) {
    // Delete the file
    fs.unlinkSync(envFile);
    console.log(`${envFile} has been deleted.`);
  } else {
    console.log(`${envFile} does not exist. Nothing to delete.`);
  }
};
