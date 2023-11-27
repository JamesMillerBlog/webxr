import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { Server } from '../Server';
import { LambdaResponse } from '../../../shared/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ENV } from '../common/consts';

export interface Route {
  key: string;
  handler: aws.lambda.CallbackFunction<APIGatewayProxyEvent, LambdaResponse>;
}

export class WebsocketLambda {
  routes: Route[];
  constructor(parent: Server, name: string) {
    const modules: aws.lambda.LayerVersion = new aws.lambda.LayerVersion(
      `${name}_node_modules`,
      {
        code: new pulumi.asset.AssetArchive({
          '/nodejs/node_modules': new pulumi.asset.FileArchive(
            `${__dirname}/../../build/node_modules`,
          ),
        }),
        compatibleRuntimes: ['nodejs16.x'],
        layerName: `${name}_node_modules_layer`,
      },
      { parent },
    );

    const layers = [modules.arn];

    const lambdaRole = new aws.iam.Role(
      `${name}_lambdaRole`,
      {
        assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
          Service: 'lambda.amazonaws.com',
        }),
      },
      { parent },
    );

    new aws.iam.RolePolicy(
      `${name}_dynamoDbPolicy`,
      {
        role: lambdaRole.id,
        policy: pulumi.output({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'dynamodb:DescribeTable',
                'dynamodb:Query',
                'dynamodb:Scan',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
              ],
              Resource: '*',
            },
          ],
        }),
      },
      { parent },
    );

    new aws.iam.RolePolicy(
      `${name}_executeApiPolicy`,
      {
        role: lambdaRole.id,
        policy: pulumi.output({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['execute-api:ManageConnections', 'execute-api:Invoke'],
              Resource: ['arn:aws:execute-api:*:*:**/@connections/*'],
            },
          ],
        }),
      },
      { parent },
    );

    new aws.iam.RolePolicyAttachment(
      `${name}_lambdaRoleAttachment`,
      {
        role: lambdaRole,
        policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
      },
      { parent },
    );

    this.routes = [
      {
        key: '$default',
        handler: new aws.lambda.Function(
          `${name}_default_lambda`,
          {
            name: `${name}_default_lambda`,
            runtime: 'nodejs16.x',
            handler: 'server/app/positions/lambdas/default.handler',
            code: new pulumi.asset.FileArchive(`${__dirname}/../../dist`),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
      },
      {
        key: '$connect',
        handler: new aws.lambda.Function(
          `${name}_connect_lambda`,
          {
            name: `${name}_connect_lambda`,
            runtime: 'nodejs16.x',
            handler: 'server/app/positions/lambdas/connect.handler',
            code: new pulumi.asset.FileArchive(`${__dirname}/../../dist`),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
      },
      {
        key: '$disconnect',
        handler: new aws.lambda.Function(
          `${name}_disconnect_lambda`,
          {
            name: `${name}_disconnect_lambda`,
            runtime: 'nodejs16.x',
            handler: 'server/app/positions/lambdas/disconnect.handler',
            code: new pulumi.asset.FileArchive(`${__dirname}/../../dist`),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
      },
    ];
  }
}
