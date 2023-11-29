import { execSync } from 'child_process';

export const checkS3Exists = async (bucket: string) => {
  try {
    execSync(`aws s3api head-bucket --bucket ${bucket}`);
    console.log(`Bucket ${bucket} already exists. Skipping bucket creation.`);
    return true;
  } catch (error) {
    console.log('Bucket does not yet exist, will create the bucket.');
  }
};

// Function to check if the AWS CLI is configured
export const checkAwsCliIsConfigured = (): void => {
  try {
    execSync('aws s3 ls');
  } catch (error) {
    console.error(
      "Error: AWS CLI is not configured. Please run 'aws configure' to set up your credentials and default region.",
    );
    process.exit(1);
  }
};

// Function to delete an S3 bucket
export const deleteS3Bucket = (bucketName: string): void => {
  try {
    execSync(`aws s3 rm s3://${bucketName} --recursive`);
    execSync(`aws s3api delete-bucket --bucket ${bucketName}`);
    console.log(`S3 bucket deleted successfully: ${bucketName}`);
  } catch (error) {
    console.error(`Failed to delete S3 bucket: ${bucketName}`);
  }
};

// Function to create an S3 bucket
export const createS3Bucket = (bucketName: string): void => {
  try {
    execSync(
      `aws s3api create-bucket --bucket ${bucketName} --create-bucket-configuration LocationConstraint=${process.env.AWS_REGION}`,
    );
    console.log(`S3 bucket created successfully: ${bucketName}`);
  } catch (e) {
    const error = String(e);
    if (error.includes('BucketAlreadyOwnedByYou')) {
      console.log(
        `Bucket ${bucketName} already owned by you. Skipping bucket creation.`,
      );
    } else {
      throw new Error(`Failed to create S3 bucket: ${bucketName}`);
    }
  }
};

// Function to check if a secret exists in AWS Secrets Manager
export const checkSecretExists = (secretName: string): boolean => {
  try {
    execSync(`aws secretsmanager describe-secret --secret-id ${secretName}`);
    return true;
  } catch (error) {
    return false;
  }
};

// Function to create or update a secret in AWS Secrets Manager
export const createSecret = (
  secretName: string,
  secretValue: Record<string, string>,
  region: string,
): void => {
  console.log(`Attempting to create secret ${secretName}...`);

  try {
    execSync(
      `aws secretsmanager create-secret --name ${secretName} --secret-string '${JSON.stringify(
        secretValue,
      )}' --region ${region}`,
    );
    console.log(`Secret ${secretName} created successfully.`);
  } catch (e) {
    const error = String(e);
    const message = error.includes('ResourceExistsException')
      ? `${secretName} already exists`
      : `Error creating secret ${secretName}. AWS CLI returned status ${error}.`;
    console.warn(message);
  }
};

export const deleteSecret = (secretName: string) => {
  // AWS CLI command to delete the Secrets Manager secret
  const awsCommand = `aws secretsmanager delete-secret --secret-id ${secretName}`;

  try {
    // Run the AWS CLI command using execSync
    execSync(awsCommand, { stdio: 'inherit' });
    console.log(`Secret ${secretName} deleted successfully.`);
  } catch (e) {
    const error = String(e);
    console.error(`Error deleting secret ${secretName}:`, error);
  }
};

export const retrieveSecret = (secretName: string) => {
  // Retrieve the secret value from AWS Secrets Manager
  try {
    const rawSecret = JSON.parse(
      execSync(
        `aws secretsmanager get-secret-value --secret-id "${secretName}" --output json`,
      ).toString(),
    );
    return JSON.parse(rawSecret.SecretString);
  } catch (error) {
    console.error('Failed to retrieve secret from AWS Secrets Manager');
    return undefined;
  }
};
