import * as pulumi from '@pulumi/pulumi';
import { NAME, PROJECT_STACK } from '../../shared/infrastructure/common';
import {
  RestApiGateway,
  WebsocketApiGateway,
  Route53,
  RestLambda,
  WebsocketLambda,
  Endpoint,
  Route,
} from './resources';

export class Server extends pulumi.ComponentResource {
  constructor(opts?: pulumi.ResourceOptions) {
    super('Server', `${NAME}_server`, {}, opts, undefined);
  }

  restApiGateway(
    endpoints: Endpoint[],
    edgeCertificationArn: string,
    cognitoUserPoolArn: string,
    deploymentVersion: string,
  ) {
    return new RestApiGateway(
      this,
      `${PROJECT_STACK}_rest_api`,
      endpoints,
      edgeCertificationArn,
      cognitoUserPoolArn,
      deploymentVersion,
    );
  }

  websocketApiGateway(
    routes: Route[],
    regionalCertificateArn: string,
    deploymentVersion: string,
  ) {
    return new WebsocketApiGateway(
      this,
      `${PROJECT_STACK}_websockets_api`,
      routes,
      regionalCertificateArn,
      deploymentVersion,
    );
  }

  restLambda() {
    return new RestLambda(this, PROJECT_STACK);
  }

  websocketLambda() {
    return new WebsocketLambda(this, `${PROJECT_STACK}_websockets`);
  }

  route53(
    domain: string,
    restApiGateway: RestApiGateway,
    websocketApiGateway: WebsocketApiGateway,
  ) {
    return new Route53(domain, restApiGateway, websocketApiGateway, this);
  }
}
