import * as aws from "@pulumi/aws";
import { Client } from "../Client";
import { getDomainAndSubdomain } from "../../../shared/infrastructure/common";
import { Output } from "@pulumi/pulumi";

export class Route53 {
  aRecord: aws.route53.Record;

  constructor(
    targetDomain: string,
    cdnDomainName: Output<string>,
    cdnHostedZoneId: Output<string>,
    parent: Client
  ) {
    const domainParts = getDomainAndSubdomain(targetDomain);
    const hostedZoneId = aws.route53
      .getZone({ name: domainParts.parentDomain }, { async: true })
      .then((zone) => zone.zoneId);

    this.aRecord = new aws.route53.Record(
      targetDomain,
      {
        name: domainParts.subdomain,
        zoneId: hostedZoneId,
        type: "A",
        aliases: [
          {
            name: cdnDomainName,
            zoneId: cdnHostedZoneId,
            evaluateTargetHealth: true,
          },
        ],
      },
      { parent }
    );
  }
}
