import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Bucket } from "@pulumi/aws/s3";
import { Distribution, OriginAccessIdentity } from "@pulumi/aws/cloudfront";
import { Client } from "../Client";
import { TEN_MINUTES } from "../../../shared/infrastructure/common";

export class Cloudfront {
  public cdn: Distribution;
  public originAccessIdentity: OriginAccessIdentity;

  constructor(
    certificateArn: string,
    contentBucket: Bucket,
    targetDomain: string,
    parent: Client
  ) {
    this.originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
      `${targetDomain}_origin_access_identity`,
      {
        comment: "this is needed to setup s3 polices and make s3 not public.",
      },
      { parent }
    );

    const dependsOn: pulumi.Input<pulumi.Resource>[] = [];

    const distributionArgs = this.configureCdn(
      certificateArn,
      contentBucket,
      this.originAccessIdentity,
      targetDomain
    );

    this.cdn = new aws.cloudfront.Distribution(
      `${targetDomain}_cdn`,
      distributionArgs,
      {
        parent,
        dependsOn,
      }
    );
  }

  configureCdn(
    certificateArn: pulumi.Input<string>,
    contentBucket: Bucket,
    originAccessIdentity: OriginAccessIdentity,
    targetDomain: string
  ) {
    const distributionAliases = [targetDomain];
    const distributionArgs: aws.cloudfront.DistributionArgs = {
      enabled: true,
      aliases: distributionAliases,

      origins: [
        {
          originId: contentBucket.arn,
          domainName: contentBucket.bucketRegionalDomainName,
          s3OriginConfig: {
            originAccessIdentity:
              originAccessIdentity.cloudfrontAccessIdentityPath,
          },
        },
      ],

      defaultRootObject: "index.html",
      defaultCacheBehavior: {
        targetOriginId: contentBucket.arn,

        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD", "OPTIONS"],

        forwardedValues: {
          cookies: { forward: "none" },
          queryString: false,
        },

        minTtl: 0,
        defaultTtl: TEN_MINUTES,
        maxTtl: TEN_MINUTES,
      },

      // "All" is the most broad distribution, and also the most expensive.
      // "100" is the least broad, and also the least expensive.
      priceClass: "PriceClass_100",
      customErrorResponses: [
        { errorCode: 404, responseCode: 404, responsePagePath: "/404.html" },
      ],

      restrictions: {
        geoRestriction: {
          restrictionType: "none",
        },
      },

      viewerCertificate: {
        acmCertificateArn: certificateArn,
        sslSupportMethod: "sni-only",
      },
    };

    return distributionArgs;
  }
}
