import * as aws from '@pulumi/aws';

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket('my-bucket');

// Export the name of the bucket
export const bucketName = bucket.id;

// https://github.com/pulumi/examples/tree/master/aws-ts-apigateway-lambda-serverless
// https://blog.bitsrc.io/managing-micro-stacks-using-pulumi-87053eeb8678
