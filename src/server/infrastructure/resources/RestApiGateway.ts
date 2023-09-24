import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import {
  getHandler,
  putHandler,
  postHandler,
  GetParams,
  UserData,
} from '../../dist/server/app/users/user.lambda';
import { Server } from '../Server';
import { DOMAIN, STACK } from '../../../shared/infrastructure/common';
import { Resource, RestApi } from '@pulumi/aws/apigateway';

export class RestApiGateway {
  parent: Server;
  restApi: RestApi;
  resource: Resource;

  constructor(parent: Server, name: string) {
    // Assume getLambdaHandler, putLambdaHandler, and postLambdaHandler are AWS Lambda Function Handlers
    this.parent = parent;

    this.restApi = new aws.apigateway.RestApi(
      `api.${DOMAIN}`,
      {
        name: `api.${DOMAIN}`,
        endpointConfiguration: {
          types: 'REGIONAL',
        },
      },
      { parent },
    );

    this.resource = new aws.apigateway.Resource(
      `${name}_resource`,
      {
        restApi: this.restApi,
        parentId: this.restApi.rootResourceId,
        pathPart: 'user',
      },
      { parent },
    );

    const endpoints = [
      {
        method: 'GET',
        handler: new aws.lambda.CallbackFunction(
          'getLambda',
          {
            name: 'getLambda',
            callback: async (ev: GetParams) => await getHandler(ev),
          },
          { parent },
        ),
      },
      {
        method: 'PUT',
        handler: new aws.lambda.CallbackFunction(
          `${name}_putLambda`,
          {
            name: `${name}_putLambda`,
            callback: async (ev: UserData) => await putHandler(ev),
          },
          { parent },
        ),
      },
      {
        method: 'POST',
        handler: new aws.lambda.CallbackFunction(
          `${name}_postLambda`,
          {
            name: `${name}_postLambda`,
            callback: async (ev: UserData) => await postHandler(ev),
          },
          { parent },
        ),
      },
    ];

    const deploymentDeps: pulumi.Input<pulumi.Resource>[] = [];

    for (let x = 0; x < endpoints.length; x++) {
      const { method, handler } = endpoints[x];
      const apiMethod = new aws.apigateway.Method(
        `${name}_method_${method}`,
        {
          restApi: this.restApi,
          resourceId: this.resource.id,
          httpMethod: method,
          authorization: 'NONE',
          apiKeyRequired: false,
          requestParameters: {
            'method.request.header.test-header': true,
          },
        },
        { dependsOn: [this.restApi, this.resource], parent: this.parent },
      );

      const integration = new aws.apigateway.Integration(
        `${name}_integration_${method}`,
        {
          restApi: this.restApi.id,
          resourceId: this.resource.id,
          httpMethod: method,
          type: 'AWS_PROXY',
          integrationHttpMethod: 'POST',
          uri: handler.invokeArn,
        },
        { dependsOn: [apiMethod, handler], parent: this.parent },
      );
      deploymentDeps.push(integration);
    }
    new aws.apigateway.Deployment(
      `${name}_deployment`,
      {
        restApi: this.restApi,
        stageName: STACK,
      },
      {
        dependsOn: [...deploymentDeps, this.restApi],
        parent,
      },
    );
  }
}
