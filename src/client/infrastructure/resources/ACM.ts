import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { getDomainAndSubdomain } from "../common/utils";
import { TEN_MINUTES } from "../common";
import { Client } from "../Client";
import { CertificateValidation } from "@pulumi/aws/acm";

export class ACM {
  certificateArn: string | pulumi.Output<string>;
  certificateValidation: CertificateValidation | undefined;
  needsToBeGenerated: boolean;

  constructor(
    certificateArn: string | undefined,
    profile: string,
    targetDomain: string,
    parent: Client
  ) {
    if (certificateArn) {
      this.needsToBeGenerated = false;
      this.certificateArn = certificateArn;
    } else {
      this.needsToBeGenerated = true;
      const certificateConfig: aws.acm.CertificateArgs = {
        domainName: targetDomain,
        validationMethod: "DNS",
        subjectAlternativeNames: [],
      };

      const domainParts = getDomainAndSubdomain(targetDomain);

      const eastRegion = new aws.Provider(
        "east",
        {
          profile,
          region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
        },
        { parent }
      );

      const certificate = new aws.acm.Certificate(
        "certificate",
        certificateConfig,
        {
          provider: eastRegion,
          parent,
        }
      );

      const hostedZoneId = aws.route53
        .getZone({ name: domainParts.parentDomain }, { async: true, parent })
        .then((zone) => zone.zoneId);

      const certificateValidationDomain = new aws.route53.Record(
        `${targetDomain}-validation`,
        {
          name: certificate.domainValidationOptions[0].resourceRecordName,
          zoneId: hostedZoneId,
          type: certificate.domainValidationOptions[0].resourceRecordType,
          records: [certificate.domainValidationOptions[0].resourceRecordValue],
          ttl: TEN_MINUTES,
        },
        {
          parent,
        }
      );

      const certificateValidation = new aws.acm.CertificateValidation(
        "certificateValidation",
        {
          certificateArn: certificate.arn,
          validationRecordFqdns: [certificateValidationDomain.fqdn],
        },
        { provider: eastRegion, parent }
      );

      this.certificateValidation = certificateValidation;
      this.certificateArn = certificateValidation.certificateArn;
    }
  }
}
