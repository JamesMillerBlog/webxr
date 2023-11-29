import {
  checkAwsCliIsConfigured,
  checkS3Exists,
  deleteS3Bucket,
  loadEnvVariables,
} from '../utils';

(async () => {
  checkAwsCliIsConfigured();

  loadEnvVariables('.env.client.local');
  loadEnvVariables('.env.server.local');

  const projectName = process.env.PROJECT_NAME;
  if (!projectName) {
    console.error('No PROJECT_NAME env found');
    process.exit(1);
  }

  const bucketToCreate = `${projectName}-pulumi-backend-state`;

  const stateBucketAlreadyExist = await checkS3Exists(bucketToCreate);

  console.log(`Will now attempt to delete ${bucketToCreate}`);

  if (stateBucketAlreadyExist) {
    console.log(`Deleting ${bucketToCreate} bucket...`);
    deleteS3Bucket(bucketToCreate);
  } else {
    console.log(`State ${bucketToCreate} bucket does not exist`);
  }
  console.log('');
  console.log('');
})();
