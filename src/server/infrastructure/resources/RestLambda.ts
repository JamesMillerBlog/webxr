import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { Server } from '../Server';
import { LambdaResponse } from '../../../shared/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ENV } from '../common/consts';

export interface Endpoint {
  method: string;
  handler: aws.lambda.CallbackFunction<APIGatewayProxyEvent, LambdaResponse>;
  pathParams: boolean;
  authorizer: boolean;
}

export interface Resources {
  path: string;
  endpoints: Endpoint[];
}

export class RestLambda {
  resources: Resources[];
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
                'chime:CreateMeeting',
                'chime:DeleteMeeting',
                'chime:CreateAttendee',
                'chime:DeleteAttendee',
                'chime:GetMeeting',
                'chime:ListAttendees',
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

    const userEndpoints = [
      {
        method: 'GET',
        authorizer: true,
        handler: new aws.lambda.Function(
          `${name}_get_lambda`,
          {
            name: `${name}_get_lambda`,
            runtime: 'nodejs16.x',
            handler: 'server/app/users/lambdas/get.handler',
            code: new pulumi.asset.FileArchive(`${__dirname}/../../dist`),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
        pathParams: false,
      },
      {
        method: 'GET',
        authorizer: true,
        handler: new aws.lambda.Function(
          `${name}_get_one_lambda`,
          {
            name: `${name}_get_one_lambda`,
            runtime: 'nodejs16.x',
            handler: 'server/app/users/lambdas/get.handler',
            code: new pulumi.asset.FileArchive(`${__dirname}/../../dist`),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
        pathParams: true,
      },
      {
        method: 'PUT',
        authorizer: true,
        handler: new aws.lambda.Function(
          `${name}_put_lambda`,
          {
            name: `${name}_put_lambda`,
            runtime: 'nodejs16.x',
            handler: 'server/app/users/lambdas/put.handler',
            code: new pulumi.asset.FileArchive(`${__dirname}/../../dist`),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
        pathParams: true,
      },
      {
        method: 'POST',
        authorizer: true,
        handler: new aws.lambda.Function(
          `${name}_post_lambda`,
          {
            name: `${name}_post_lambda`,
            runtime: 'nodejs16.x',
            handler: 'server/app/users/lambdas/post.handler',
            code: new pulumi.asset.FileArchive(`${__dirname}/../../dist`),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
        pathParams: false,
      },
      {
        method: 'OPTIONS',
        authorizer: false,
        handler: new aws.lambda.Function(
          `${name}_options_lambda`,
          {
            name: `${name}_options_lambda`,
            runtime: 'nodejs16.x',
            handler: 'index.handler',
            code: new pulumi.asset.AssetArchive({
              'index.js': new pulumi.asset.StringAsset(
                `exports.handler = async function (event, context) {
                return {
                  statusCode: 200,
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                  },
                };
              };`,
              ),
            }),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
        pathParams: false,
      },
      {
        method: 'OPTIONS',
        authorizer: false,
        handler: new aws.lambda.Function(
          `${name}_options_path_params_lambda`,
          {
            name: `${name}_options_path_params_lambda`,
            runtime: 'nodejs16.x',
            handler: 'index.handler',
            code: new pulumi.asset.AssetArchive({
              'index.js': new pulumi.asset.StringAsset(
                `exports.handler = async function (event, context) {
                  return {
                    statusCode: 200,
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Credentials': true,
                      'Access-Control-Allow-Methods': 'OPTIONS, GET, PUT',
                      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                  };
                };`,
              ),
            }),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
        pathParams: true,
      },
    ];

    const chimeEndpoints = [
      {
        method: 'POST',
        authorizer: true,
        handler: new aws.lambda.Function(
          `${name}_join_meeting_post_lambda`,
          {
            name: `${name}_join_meeting_lambda`,
            runtime: 'nodejs16.x',
            handler: 'server/app/chime/lambdas/joinMeeting.handler',
            code: new pulumi.asset.FileArchive(`${__dirname}/../../dist`),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
        pathParams: false,
      },
      {
        method: 'OPTIONS',
        authorizer: false,
        handler: new aws.lambda.Function(
          `${name}_join_meeting_options_lambda`,
          {
            name: `${name}_join_meeting_options_lambda`,
            runtime: 'nodejs16.x',
            handler: 'index.handler',
            code: new pulumi.asset.AssetArchive({
              'index.js': new pulumi.asset.StringAsset(
                `exports.handler = async function (event, context) {
                return {
                  statusCode: 200,
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                  },
                };
              };`,
              ),
            }),
            role: lambdaRole.arn,
            layers,
            environment: ENV,
          },
          { parent },
        ),
        pathParams: false,
      },
    ];

    this.resources = [
      {
        path: 'user',
        endpoints: userEndpoints,
      },
      {
        path: 'joinMeeting',
        endpoints: chimeEndpoints,
      },
    ];
  }
}
