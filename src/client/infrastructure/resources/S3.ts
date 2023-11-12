import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as mime from "mime";
import * as path from "path";
import { Bucket } from "@pulumi/aws/s3";
import { OriginAccessIdentity } from "@pulumi/aws/cloudfront";
import { Client } from "../Client";

export class S3 {
  contentBucketUri: pulumi.Output<string>;
  contentBucketWebsiteEndpoint: pulumi.Output<string>;

  contentBucket: Bucket;
  parent: Client;
  webContentsRootPath = "./../../client/out";

  constructor(bucket: string, parent: Client) {
    this.parent = parent;
    this.contentBucket = this.setup(bucket);

    this.contentBucketUri = pulumi.interpolate`s3://${this.contentBucket.bucket}`;
    this.contentBucketWebsiteEndpoint = this.contentBucket.websiteEndpoint;
  }

  setup(bucket: string) {
    return new aws.s3.Bucket(
      "contentBucket",
      {
        bucket,
        website: {
          indexDocument: "index.html",
          errorDocument: "404.html",
        },
      },
      { parent: this.parent }
    );
  }

  attachBucketPolicy(
    bucket: Bucket,
    originAccessIdentity: OriginAccessIdentity
  ) {
    new aws.s3.BucketPolicy(
      "bucketPolicy",
      {
        bucket: bucket.id, // refer to the bucket created earlier
        policy: pulumi.jsonStringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                AWS: originAccessIdentity.iamArn,
              }, // Only allow Cloudfront read access.
              Action: ["s3:GetObject"],
              Resource: [pulumi.interpolate`${bucket.arn}/*`], // Give Cloudfront access to the entire bucket.
            },
          ],
        }),
      },
      { parent: this.parent }
    );
  }

  initiateFileUpload(deploymentVersion: string) {
    // Sync the contents of the source directory with the S3 bucket, which will in-turn show up on the CDN.
    const webContentsRootPath = path.join(
      process.cwd(),
      this.webContentsRootPath
    );
    // console.log("Syncing contents from local disk at", webContentsRootPath);
    this.crawlDirectory(webContentsRootPath, deploymentVersion);
  }

  crawlDirectory(dir: string, deploymentVersion: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = `${dir}/${file}`;
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) this.crawlDirectory(filePath, deploymentVersion);
      if (stat.isFile()) this.uploadFile(filePath, deploymentVersion);
    }
  }

  uploadFile(filePath: string, version: string) {
    const key = filePath.split("out/")[1];
    new aws.s3.BucketObject(
      filePath,
      {
        tags: { version },
        key,
        bucket: this.contentBucket,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        contentType: mime.getType(filePath) || undefined,
        source: new pulumi.asset.FileAsset(filePath),
      },
      {
        parent: this.parent,
      }
    );
  }
}
