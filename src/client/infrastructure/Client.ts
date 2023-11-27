import * as pulumi from "@pulumi/pulumi";
import { NAME } from "./../../shared/infrastructure/common";
import { S3, Cloudfront, Route53 } from "./resources";
import { Bucket } from "@pulumi/aws/s3";

export class Client extends pulumi.ComponentResource {
  constructor(opts?: pulumi.ResourceOptions) {
    super("Client", `${NAME}_client`, {}, opts, undefined);
  }

  s3(domain: string) {
    return new S3(domain, this);
  }

  cloudfront(
    edgeCertificationArn: string,
    contentBucket: Bucket,
    domain: string
  ) {
    return new Cloudfront(edgeCertificationArn, contentBucket, domain, this);
  }

  route53(
    domain: string,
    cdnDomainName: pulumi.Output<string>,
    cdnHostedZoneId: pulumi.Output<string>
  ) {
    return new Route53(domain, cdnDomainName, cdnHostedZoneId, this);
  }
}
