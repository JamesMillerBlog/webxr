import * as aws from '@pulumi/aws';
import { Server } from '../Server';
import * as pulumi from '@pulumi/pulumi';
import { UserData, postHandler } from '../../dist/server/app/users/user.lambda';
import { DOMAIN, STACK } from '../../../shared/infrastructure/common';

export class WebsocketApiGateway {
  constructor(parent: Server, name: string) {
    const gateway = new aws.apigatewayv2.Api(
      `ws.${DOMAIN}`,
      {
        name: `ws.${DOMAIN}`,
        protocolType: 'WEBSOCKET',
        routeSelectionExpression: '$request.body.action',
      },
      { parent },
    );

    const lambda = new aws.lambda.CallbackFunction(
      `${name}_ws_handler`,
      {
        name: `${name}_ws_handler`,
        callback: async (ev: UserData) => await postHandler(ev),
      },
      { parent },
    );

    // Lambda function log events permission
    new aws.lambda.Permission(
      `${name}_ws_cloudwatch_lambda_permission`,
      {
        statementId: 'AllowExecutionFromCloudWatch',
        action: 'lambda:InvokeFunction',
        function: lambda.name,
        principal: 'logs.amazonaws.com',
      },
      { parent },
    );

    const exampleIntegration = new aws.apigatewayv2.Integration(
      `${name}_integration`,
      {
        apiId: gateway.id,
        integrationType: 'AWS_PROXY',
        integrationMethod: 'POST',
        integrationUri: lambda.arn,
      },
      { parent },
    );

    const defaultRoute = new aws.apigatewayv2.Route(
      `${name}_default_route`,
      {
        apiId: gateway.id,
        routeKey: '$default',
        target: pulumi.interpolate`integrations/${exampleIntegration.id}`,
      },
      { parent },
    );

    const exampleDeployment = new aws.apigatewayv2.Deployment(
      `${name}_example_deployment`,
      {
        apiId: gateway.id,
      },
      { parent, dependsOn: [defaultRoute] },
    );

    new aws.apigatewayv2.Stage(
      STACK,
      {
        name: STACK,
        apiId: gateway.id,
        autoDeploy: true,
        deploymentId: exampleDeployment.id,
      },
      { parent },
    );

    new aws.lambda.Permission(
      `${name}_lambda_permission`,
      {
        action: 'lambda:InvokeFunction',
        function: lambda.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${gateway.executionArn}/*/*`,
      },
      { parent },
    );
  }
}
