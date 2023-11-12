import * as pulumi from "@pulumi/pulumi";
import { NAME, DOMAIN } from "./../../shared/infrastructure/common";
import { S3, Cloudfront, Route53 } from "./resources";
import { ACM } from "../../shared/infrastructure/resources";

export class Client extends pulumi.ComponentResource {
  public contentBucketUri: pulumi.Output<string>;
  public contentBucketWebsiteEndpoint: pulumi.Output<string>;
  public cloudFrontDomain: pulumi.Output<string>;
  public targetDomainEndpoint: string;

  constructor(
    acm: ACM,
    deploymentVersion: string,
    opts?: pulumi.ResourceOptions
  ) {
    // type: string, name: string, args?: pulumi.Inputs | undefined, opts?: pulumi.ComponentResourceOptions | undefined, remote?: boolean | undefined
    super("Client", `${NAME}_client`, {}, opts, undefined);
    // super("wrapperjs:webxr:Client", name, {}, opts);

    const s3 = new S3(DOMAIN, this);

    s3.initiateFileUpload(deploymentVersion);

    const cloudfront = new Cloudfront(acm, s3.contentBucket, DOMAIN, this);

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
