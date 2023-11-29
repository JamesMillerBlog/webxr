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

  const bucketToDelete = `${projectName}-pulumi-backend-state`;

  const stateBucketAlreadyExist = await checkS3Exists(bucketToDelete);

  console.log(`Will now attempt to delete ${bucketToDelete}`);

  if (stateBucketAlreadyExist) {
    console.log(`Deleting ${bucketToDelete} bucket...`);
    deleteS3Bucket(bucketToDelete);
  } else {
    console.log(`State ${bucketToDelete} bucket does not exist`);
  }
  console.log('');
  console.log('');
})();
