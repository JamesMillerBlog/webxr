import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { S3, ACM, Cloudfront, Route53 } from "./resources";

export class Client extends pulumi.ComponentResource {
    public contentBucketUri: pulumi.Output<string>;
    public contentBucketWebsiteEndpoint: pulumi.Output<string>;
    public cloudFrontDomain: pulumi.Output<string>;
    public targetDomainEndpoint: string;

    constructor(name: string, config: pulumi.Config, opts?: pulumi.ResourceOptions) {
        super("wrapperjs:webxr:Client", name, {}, opts)

        // const pathToWebsiteContents = config.require("pathToWebsiteContents")
        const targetDomain = config.require("targetDomain");
        const certificateArn = config.get("certificateArn");

        const s3 = new S3(targetDomain, this);

        const acm = new ACM(certificateArn, aws.config.profile!, targetDomain, this);

        const cloudfront = new Cloudfront(acm, s3.contentBucket, targetDomain, this)
        
        s3.attachBucketPolicy(s3.contentBucket, cloudfront.originAccessIdentity)
        
        new Route53(targetDomain, cloudfront.cdn, this)

        this.contentBucketUri = s3.contentBucketUri;
        this.contentBucketWebsiteEndpoint = s3.contentBucketWebsiteEndpoint;
        this.cloudFrontDomain = cloudfront.cdn.domainName;
        this.targetDomainEndpoint = `https://${targetDomain}/`;

        this.registerOutputs({
            contentBuckerUri: this.contentBucketUri,
            contentBucketWebsiteEndpoint: this.contentBucketWebsiteEndpoint,
            cloudfrontDomain: this.cloudFrontDomain,
            targetDomainEndpoint: this.targetDomainEndpoint
        })
    }
}