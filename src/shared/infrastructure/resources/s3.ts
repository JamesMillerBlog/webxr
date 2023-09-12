import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// import * as fs from "fs";
// import * as mime from "mime";
// import * as path from "path";
import { config } from './../'
import { Bucket } from "@pulumi/aws/s3";
import { OriginAccessIdentity } from "@pulumi/aws/cloudfront";
// contentBucket is the S3 bucket that the website's contents will be stored in.
export const setupBucket = () => {
    const contentBucket = new aws.s3.Bucket("contentBucket", {
        bucket: config.targetDomain,
        // acl: "public-read",
        
        // objectOwnership: "BucketOwnerPreferred", // Use BucketOwnerPreferred for Object Ownership.
        // policy: {
        //     "Version": "2012-10-17",
        //     "Statement": [
        //         {
        //             "Effect": "Allow",
        //             "Principal": {
        //                 "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EU435DN5RYJ6L"
        //             },
        //             "Action": "s3:GetObject",
        //             "Resource": "arn:aws:s3:::newpilot.app/*"
        //         }
        //     ]
        // },
        // Configure S3 to serve bucket contents as a website. This way S3 will automatically convert
        // requests for "foo/" to "foo/index.html".
        website: {
            indexDocument: "index.html",
            errorDocument: "404.html",
        },
    });
    return contentBucket;
}

export const attachBucketPolicy = (contentBucket: Bucket, originAccessIdentity: OriginAccessIdentity) => {
    const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
        bucket: contentBucket.id, // refer to the bucket created earlier
        policy: pulumi.jsonStringify({
            Version: "2012-10-17",
            Statement: [
                {
                Effect: "Allow",
                Principal: {
                    AWS: originAccessIdentity.iamArn,
                }, // Only allow Cloudfront read access.
                Action: ["s3:GetObject"],
                Resource: [pulumi.interpolate `${contentBucket.arn}/*`], // Give Cloudfront access to the entire bucket.
                },
            ],
        },
    )});
    return bucketPolicy;
}



// crawlDirectory recursive crawls the provided directory, applying the provided function
// to every file it contains. Doesn't handle cycles from symlinks.
// function crawlDirectory(dir: string, f: (_: string) => void) {
//     const files = fs.readdirSync(dir);
//     for (const file of files) {
//         const filePath = `${dir}/${file}`;
//         const stat = fs.statSync(filePath);
//         if (stat.isDirectory()) {
//             crawlDirectory(filePath, f);
//         }
//         if (stat.isFile()) {
//             f(filePath);
//         }
//     }
// }

// Sync the contents of the source directory with the S3 bucket, which will in-turn show up on the CDN.
// const webContentsRootPath = path.join(process.cwd(), config.pathToWebsiteContents);
// console.log("Syncing contents from local disk at", webContentsRootPath);
// crawlDirectory(
//     webContentsRootPath,
//     (filePath: string) => {
//         const relativeFilePath = filePath.replace(webContentsRootPath + "/", "");
//         const contentFile = new aws.s3.BucketObject(
//             relativeFilePath,
//             {
//                 key: relativeFilePath,

//                 acl: "public-read",
//                 bucket: contentBucket,
//                 //@ts-ignore
//                 contentType: mime.getType(filePath) || undefined,
//                 source: new pulumi.asset.FileAsset(filePath),
//             },
//             {
//                 parent: contentBucket,
//             });
//     });

// logsBucket is an S3 bucket that will contain the CDN's request logs.
// const logsBucket = new aws.s3.Bucket("requestLogs",
//     {
//         bucket: `${config.targetDomain}-logs`,
//         acl: "private",
    // });