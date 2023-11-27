import {
  addToEnvFile,
  checkAwsCliIsConfigured,
  checkS3Exists,
  createEnvFileIfNotExist,
  createS3Bucket,
  deleteS3Bucket,
  loadEnvVariables,
} from '../utils';

(async () => {
  checkAwsCliIsConfigured();

  createEnvFileIfNotExist('.env.local');
  loadEnvVariables('.env.client.local');
  loadEnvVariables('.env.server.local');

  const projectName = process.env.PROJECT_NAME;
  if (!projectName) {
    console.error('No PROJECT_NAME env found');
    process.exit(1);
  }

  const bucketToCreate = `${projectName}-pulumi-backend-state`;

  const stateBucketAlreadyExist = await checkS3Exists(bucketToCreate);

  console.log(
    `Will now attempt to set up ${bucketToCreate} S3 bucket to store pulumi state.`,
  );

  if (stateBucketAlreadyExist) {
    console.log(
      `State ${bucketToCreate} bucket already exist, will not attempt to create`,
    );
  } else {
    console.log(`Creating ${bucketToCreate} bucket...`);
    try {
      createS3Bucket(bucketToCreate);
    } catch (e) {
      deleteS3Bucket(bucketToCreate);
    }
  }

  // update .env.local file with state buckets
  addToEnvFile('.env.local', 'STATE_BUCKET', bucketToCreate);

  console.log('.env.local file updated successfully with S3 bucket names.');
  console.log('');
  console.log('');
})();
