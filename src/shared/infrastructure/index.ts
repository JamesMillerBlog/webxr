// Copyright 2016-2019, Pulumi Corporation.  All rights reserved.
import * as pulumi from "@pulumi/pulumi";
import { attachBucketPolicy, setupBucket } from './resources/s3'
import { createAliasRecord } from './resources/route53'
import { generateCert } from "./resources/acm";
import {  setupCdn } from "./resources/cloudfront";
// Load the Pulumi program configuration. These act as the "parameters" to the Pulumi program,
// so that different Pulumi Stacks can be brought up using the same code.

const stackConfig = new pulumi.Config();

export const config = {
    // pathToWebsiteContents is a relativepath to the website's contents.
    pathToWebsiteContents: stackConfig.require("pathToWebsiteContents"),
    // targetDomain is the domain/host to serve content at.
    targetDomain: stackConfig.require("targetDomain"),
    // (Optional) ACM certificate ARN for the target domain; must be in the us-east-1 region. If omitted, an ACM certificate will be created.
    certificateArn: stackConfig.get("certificateArn"),
    // If true create an A record for the www subdomain of targetDomain pointing to the generated cloudfront distribution.
    // If a certificate was generated it will support this subdomain.
    // default: true
    includeWWW: stackConfig.getBoolean("includeWWW") ?? true,
};

const contentBucket = setupBucket();
const certificateArn = generateCert();
const { cdn, originAccessIdentity } = setupCdn(certificateArn, contentBucket)
attachBucketPolicy(contentBucket, originAccessIdentity)
createAliasRecord(config.targetDomain, cdn);



// Export properties from this stack. This prints them at the end of `pulumi up` and
// makes them easier to access from pulumi.com.
// export const contentBucketUri = pulumi.interpolate`s3://${contentBucket.bucket}`;
// export const contentBucketWebsiteEndpoint = contentBucket.websiteEndpoint;
// export const cloudFrontDomain = cdn.domainName;
// export const targetDomainEndpoint = `https://${config.targetDomain}/`;
