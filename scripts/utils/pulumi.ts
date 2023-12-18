import * as fs from 'fs';
import { execSync } from 'child_process';

// Function to replace entire content of Pulumi.yaml file
export const replacePulumiYaml = (
  projectDir: string,
  projectName: string,
  stateBucket: string,
  description: string,
): void => {
  const pulumiYamlPath = `${projectDir}/Pulumi.yaml`;

  if (!fs.existsSync(projectDir)) {
    console.error(`Error: Directory not found - ${projectDir}`);
    process.exit(1);
  }

  fs.writeFileSync(pulumiYamlPath, `name: ${projectName}\n`);
  fs.appendFileSync(pulumiYamlPath, 'runtime: nodejs\n');
  fs.appendFileSync(pulumiYamlPath, `description: ${description}\n`);
  fs.appendFileSync(pulumiYamlPath, 'backend:\n');
  fs.appendFileSync(pulumiYamlPath, `  url: s3://${stateBucket}\n`);
};

// Function to replace entire content of Pulumi.${stack}.yaml file
export const replacePulumiStackYaml = (
  projectDir: string,
  awsRegion: string,
  domainName: string,
  projectName: string,
  stack: string,
): void => {
  const pulumiDevYamlPath = `${projectDir}/Pulumi.${stack}.yaml`;

  if (!fs.existsSync(projectDir)) {
    console.error(`Error: Directory not found - ${projectDir}`);
    process.exit(1);
  }

  // Update or append new content
  const updatedContent =
    `config:\n` +
    `  aws:region: ${awsRegion}\n` +
    `  region: ${awsRegion}\n` +
    `  targetDomain: ${domainName}\n` +
    `  projectSharedResources: ${projectName}-shared\n`;

  // Write back the updated content
  fs.writeFileSync(pulumiDevYamlPath, updatedContent);
};

// Function to run pulumi login
export const pulumiLoginAndStackSelection = (
  stateBucket: string,
  stack: string,
  directory: string,
): void => {
  process.chdir(directory);

  try {
    execSync(`pulumi login s3://${stateBucket}`);
    const pulumiStackList = execSync('pulumi stack ls').toString();
    if (!pulumiStackList.includes(stack)) {
      console.log(
        `pulumi ${stack} stack does not already exist, will create now`,
      );
      execSync(`pulumi stack init --non-interactive --stack ${stack}`);
      setTimeout(() => {
        console.log(`selecting newly created pulumi ${stack} stack`);
      }, 5000);
    } else {
      console.log(`pulumi ${stack} stack already exists, will use that`);
    }
    execSync(`pulumi stack select ${stack}`);
    console.log(`Login to pulumi stack ${stack} successful`);
    console.log('');
    console.log('');
  } catch (error) {
    console.error(
      `Error running pulumi login or stack selection: ${String(error)}`,
    );
    process.exit(1);
  }
};

export const extractPulumiEnvs = (init: boolean) => {
  const missingInitEnvs =
    !process.env.PROJECT_NAME ||
    !process.env.DOMAIN_NAME ||
    !process.env.AWS_REGION ||
    !process.env.STATE_BUCKET;

  const missingStackLoginEnvs =
    !process.env.PROJECT_NAME || !process.env.STATE_BUCKET;

  if (init && missingInitEnvs) {
    console.error(
      'Error: PROJECT_NAME, DOMAIN_NAME, AWS_REGION, or STATE_BUCKET is not found in env variables.',
    );
    process.exit(1);
  } else if (!init && missingStackLoginEnvs) {
    console.error(
      'Error: PROJECT_NAME and STATE_BUCKET are not found in env variables.',
    );
    process.exit(1);
  }

  return {
    projectName: String(process.env.PROJECT_NAME),
    domainName: String(process.env.DOMAIN_NAME),
    awsRegion: String(process.env.AWS_REGION),
    stateBucket: String(process.env.STATE_BUCKET),
    stack: String(process.env.STACK),
  };
};
