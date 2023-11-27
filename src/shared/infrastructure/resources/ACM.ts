import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { CertificateValidation } from '@pulumi/aws/acm';
import { Shared } from '../Shared';
import { TEN_MINUTES, getDomainAndSubdomain } from '../common';

export class ACM {
  certificateArn: string | pulumi.Output<string>;
  certificateValidation: CertificateValidation | undefined;
  needsToBeGenerated: boolean;

  constructor(
    name: string,
    profile: string,
    targetDomain: string,
    isEdge: boolean,
    parent: Shared
  ) {
      const type = isEdge ? 'edge' : 'regional';

      const provider = new aws.Provider(
        `${name}_${type}_cert`,
        {
          profile,
          region: isEdge ? 'us-east-1' : 'eu-west-2'
        },
        { parent },
      );


      this.needsToBeGenerated = true;
      const certificateConfig: aws.acm.CertificateArgs = {
        domainName: targetDomain,
        validationMethod: 'DNS',
        subjectAlternativeNames: [`*.${targetDomain}`],
      };

      const domainParts = getDomainAndSubdomain(targetDomain);

      const certificate = new aws.acm.Certificate(
        `${name}_${type}_certificate`,
        certificateConfig,
        {
          provider,
          parent,
        },
      );

      const hostedZoneId = aws.route53
        .getZone({ name: domainParts.parentDomain }, { async: true, parent })
        .then((zone) => zone.zoneId);

      const certificateValidationDomain = new aws.route53.Record(
        `${targetDomain}_${type}_validation`,
        {
          name: certificate.domainValidationOptions[0].resourceRecordName,
          zoneId: hostedZoneId,
          type: certificate.domainValidationOptions[0].resourceRecordType,
          records: [certificate.domainValidationOptions[0].resourceRecordValue],
          ttl: TEN_MINUTES,
        },
        {
          parent, provider, dependsOn: certificate
        },
      );

      const certificateValidation = new aws.acm.CertificateValidation(
        `${name}_${type}_certificateValidation`,
        {
          certificateArn: certificate.arn,
          validationRecordFqdns: [certificateValidationDomain.fqdn],
        },
        { provider, parent, dependsOn: [certificateValidationDomain, certificate] },
      );

      this.certificateValidation = certificateValidation;
      this.certificateArn = certificateValidation.certificateArn;
    }
}
