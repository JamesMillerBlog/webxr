import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { NAME, CONFIG, DOMAIN } from "@shared/infrastructure/common";
import { S3, ACM, Cloudfront, Route53 } from "./resources";

export class Client extends pulumi.ComponentResource {
  public contentBucketUri: pulumi.Output<string>;
  public contentBucketWebsiteEndpoint: pulumi.Output<string>;
  public cloudFrontDomain: pulumi.Output<string>;
  public targetDomainEndpoint: string;

  constructor(opts?: pulumi.ResourceOptions) {
    super({}, opts);
    // super("wrapperjs:webxr:Client", name, {}, opts);
    const certificateArn = CONFIG.get("certificateArn");

    const s3 = new S3(DOMAIN, this);

    s3.initiateFileUpload();

    const acm = new ACM(
      certificateArn,
      aws.config.profile!,
      DOMAIN,
      this
    );

    const cloudfront = new Cloudfront(
      acm,
      s3.contentBucket,
      DOMAIN,
      this
    );

    s3.attachBucketPolicy(s3.contentBucket, cloudfront.originAccessIdentity);

    new Route53(DOMAIN, cloudfront.cdn, this);

    this.contentBucketUri = s3.contentBucketUri;
    this.contentBucketWebsiteEndpoint = s3.contentBucketWebsiteEndpoint;
    this.cloudFrontDomain = cloudfront.cdn.domainName;
    this.targetDomainEndpoint = `https://${DOMAIN}/`;

    this.registerOutputs({
      contentBuckerUri: this.contentBucketUri,
      contentBucketWebsiteEndpoint: this.contentBucketWebsiteEndpoint,
      cloudfrontDomain: this.cloudFrontDomain,
      targetDomainEndpoint: this.targetDomainEndpoint,
    });
  }
}
