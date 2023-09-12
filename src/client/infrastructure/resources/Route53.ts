import * as aws from "@pulumi/aws";
import { getDomainAndSubdomain } from "../common";
import { Client } from "../Client";
import { Distribution } from "@pulumi/aws/cloudfront";

export class Route53 {
    aRecord: aws.route53.Record;

    constructor(targetDomain: string, distribution: Distribution, parent: Client) {
        const domainParts = getDomainAndSubdomain(targetDomain);
        const hostedZoneId = aws.route53.getZone({ name: domainParts.parentDomain }, { async: true }).then(zone => zone.zoneId);
        
        this.aRecord = new aws.route53.Record(targetDomain, {
            name: domainParts.subdomain,
            zoneId: hostedZoneId,
            type: "A",
            aliases: [
                {
                    name: distribution.domainName,
                    zoneId: distribution.hostedZoneId,
                    evaluateTargetHealth: true,
                },
            ],
        }, { parent });
    }
}
