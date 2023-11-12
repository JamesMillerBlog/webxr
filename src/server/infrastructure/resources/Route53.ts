import * as aws from '@pulumi/aws';
import { Server } from '../Server';
import { getDomainAndSubdomain } from '../../../client/infrastructure/common';
import { RestApiGateway } from './RestApiGateway';
import { WebsocketApiGateway } from './WebsocketApiGateway';

export class Route53 {
  constructor(
    targetDomain: string,
    restApiGateway: RestApiGateway,
    websocketApiGateway: WebsocketApiGateway,
    parent: Server,
  ) {
    const domainParts = getDomainAndSubdomain(targetDomain);
    const zoneId = aws.route53
      .getZone({ name: domainParts.parentDomain }, { async: true })
      .then((zone) => zone.zoneId);

    new aws.route53.Record(
      'apiRecord',
      {
        zoneId,
        name: `api.${targetDomain}`,
        type: 'A',
        aliases: [
          {
            name: restApiGateway.domainName.cloudfrontDomainName,
            zoneId: restApiGateway.domainName.cloudfrontZoneId,
            evaluateTargetHealth: true,
          },
        ],
      },
      {
        parent,
        dependsOn: [restApiGateway.restApi],
      },
    );

    new aws.route53.Record(
      'wsApiRecord',
      {
        zoneId,
        name: `ws.${targetDomain}`,
        type: 'A',
        aliases: [
          {
            name: websocketApiGateway.domainName.domainNameConfiguration
              .targetDomainName,
            zoneId:
              websocketApiGateway.domainName.domainNameConfiguration
                .hostedZoneId,
            evaluateTargetHealth: true,
          },
        ],
      },
      {
        parent,
        dependsOn: [websocketApiGateway.gateway],
      },
    );
  }
}
