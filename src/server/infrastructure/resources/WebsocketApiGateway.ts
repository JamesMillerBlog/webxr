import * as aws from '@pulumi/aws';
import { Server } from '../Server';
import * as pulumi from '@pulumi/pulumi';
import { DOMAIN, STACK } from '../../../shared/infrastructure/common';
import { Route } from './WebsocketLambda';
import { Api, DomainName } from '@pulumi/aws/apigatewayv2';

export class WebsocketApiGateway {
  gateway: Api;
  domainName: DomainName;

  constructor(
    parent: Server,
    name: string,
    routes: Route[],
    regionalCertificateArn: string,
    deploymentVersion: string,
  ) {
    this.gateway = new Api(
      `ws.${DOMAIN}`,
      {
        name: `ws.${DOMAIN}`,
        protocolType: 'WEBSOCKET',
        routeSelectionExpression: '$request.body.action',
      },
      { parent },
    );

    const stageName = `${STACK}_${deploymentVersion}`;
    const deploymentDeps: pulumi.Input<pulumi.Resource>[] = [];

    for (let x = 0; x < routes.length; x++) {
      const { key, handler } = routes[x];
      const keyName = key.replace('$', '');
      const lambdaName = `${name}_${keyName}`;

      new aws.lambda.Permission(
        `${lambdaName}_ws_cloudwatch_lambda_permission`,
        {
          statementId: 'AllowExecutionFromCloudWatch',
          action: 'lambda:InvokeFunction',
          function: handler.name,
          principal: 'logs.amazonaws.com',
        },
        { parent },
      );

      new aws.lambda.Permission(
        `${lambdaName}_lambda_permission`,
        {
          action: 'lambda:InvokeFunction',
          function: handler.name,
          principal: 'apigateway.amazonaws.com',
          sourceArn: pulumi.interpolate`${this.gateway.executionArn}/*/*`,
        },
        { parent },
      );

      const integration = new aws.apigatewayv2.Integration(
        `${lambdaName}_integration`,
        {
          apiId: this.gateway.id,
          integrationType: 'AWS_PROXY',
          integrationMethod: 'POST',
          integrationUri: handler.invokeArn,
        },
        { dependsOn: [handler], parent },
      );

      const route = new aws.apigatewayv2.Route(
        `${lambdaName}_route`,
        {
          apiId: this.gateway.id,
          routeKey: key,
          target: pulumi.interpolate`integrations/${integration.id}`,
        },
        { parent },
      );

      deploymentDeps.push(integration, route);
    }

    const deployment = new aws.apigatewayv2.Deployment(
      `${name}_deployment`,
      {
        apiId: this.gateway.id,
        description: `Deployment for ${stageName}`,
      },
      { parent, dependsOn: [...deploymentDeps, this.gateway] },
    );

    const stage = new aws.apigatewayv2.Stage(
      stageName,
      {
        name: stageName,
        apiId: this.gateway.id,
        autoDeploy: true,
        deploymentId: deployment.id,
      },
      { parent },
    );

    this.domainName = new aws.apigatewayv2.DomainName(
      `${name}_domain_name`,
      {
        domainName: `ws.${DOMAIN}`,
        domainNameConfiguration: {
          certificateArn: regionalCertificateArn,
          endpointType: 'REGIONAL',
          securityPolicy: 'TLS_1_2',
        },
      },
      { parent },
    );

    new aws.apigatewayv2.ApiMapping(
      `${name}_mapping`,
      {
        apiId: this.gateway.id,
        domainName: this.domainName.domainName,
        stage: stage.id,
      },
      { parent, dependsOn: [deployment, this.domainName] },
    );
  }
}
