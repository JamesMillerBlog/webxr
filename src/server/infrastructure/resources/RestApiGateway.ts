import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { Server } from '../Server';
import { DOMAIN, STACK } from '../../../shared/infrastructure/common';
import { DomainName, Resource, RestApi } from '@pulumi/aws/apigateway';
import { ACM } from '../../../shared/infrastructure/resources';
import { Endpoint } from './RestLambda';
import { Authorizer } from '@pulumi/aws/apigateway/authorizer';

export class RestApiGateway {
  domainName: DomainName;
  name: string;
  parent: Server;
  restApi: RestApi;
  resource: Resource;
  wildCardResource: Resource;

  constructor(
    parent: Server,
    name: string,
    acm: ACM,
    endpoints: Endpoint[],
    userPoolArn: pulumi.Output<string>,
    deploymentVersion: string,
  ) {
    this.parent = parent;
    this.name = name;
    const stageName = `${STACK}_${deploymentVersion}`;

    this.restApi = new aws.apigateway.RestApi(
      `api.${DOMAIN}`,
      {
        name: `api.${DOMAIN}`,
      },
      { parent },
    );

    this.resource = new aws.apigateway.Resource(
      `${name}_resource`,
      {
        restApi: this.restApi.id,
        parentId: this.restApi.rootResourceId,
        pathPart: 'user',
      },
      { parent },
    );

    this.wildCardResource = new aws.apigateway.Resource(
      `${name}_wildcardResource`,
      {
        restApi: this.restApi.id,
        parentId: this.resource.id,
        pathPart: '{uid+}',
      },
      { dependsOn: [this.resource], parent },
    );

    this.domainName = new aws.apigateway.DomainName(
      `${name}_domain`,
      {
        certificateArn: acm.certificateArn,
        domainName: `api.${DOMAIN}`,
        endpointConfiguration: { types: 'EDGE' },
        securityPolicy: 'TLS_1_2',
      },
      { parent },
    );

    const cognitoAuthorizer = new aws.apigateway.Authorizer(
      `${name}_authorizer`,
      {
        name: `${name}_cognito_authorizer`,
        restApi: this.restApi.id,
        type: 'COGNITO_USER_POOLS',
        providerArns: [userPoolArn],
      },
      {
        parent,
      },
    );

    const lambdaMethods = this.setupMethods(endpoints, cognitoAuthorizer);

    const gateway4xxStatusCodes = [];
    for (let i = 400; i < 431; i++) gateway4xxStatusCodes.push(String(i));

    const gateway4xxResponses = gateway4xxStatusCodes.map(
      (statusCode: string) => {
        return new aws.apigateway.Response(
          `${name}_default_4XX_response_${statusCode}`,
          {
            restApiId: this.restApi.id,
            statusCode: `${statusCode}`,
            responseType: 'DEFAULT_4XX',
            responseParameters: {
              'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
              'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
              'gatewayresponse.header.Access-Control-Allow-Methods': "'*'",
            },
          },
          { parent },
        );
      },
    );

    const deploymentDeps = [...lambdaMethods, ...gateway4xxResponses];

    const deployment = new aws.apigateway.Deployment(
      `${name}_deployment`,
      {
        restApi: this.restApi,
        stageName,
        description: `Deployment for ${stageName}`,
      },
      {
        dependsOn: [...deploymentDeps, this.restApi],
        parent,
      },
    );

    new aws.apigateway.BasePathMapping(
      `${name}_basepathmapping`,
      {
        restApi: this.restApi.id,
        domainName: this.domainName.domainName,
        stageName,
      },
      {
        parent,
        dependsOn: [this.domainName, deployment],
      },
    );
  }

  setupMethods(endpoints: Endpoint[], cognitoAuthorizer: Authorizer) {
    const deploymentDeps: pulumi.Input<pulumi.Resource>[] = [];

    for (let x = 0; x < endpoints.length; x++) {
      const { method, handler, pathParams, authorizer } = endpoints[x];

      const resourceId = pathParams
        ? this.wildCardResource.id
        : this.resource.id;

      const permission = pathParams ? '/*/*/*' : '/*/*';

      const lambdaName = pathParams
        ? `${this.name}_${method}_path_params`
        : `${this.name}_${method}`;

      const apiMethod = new aws.apigateway.Method(
        `${lambdaName}_method`,
        {
          restApi: this.restApi.id,
          resourceId,
          httpMethod: method,
          authorization: authorizer ? 'COGNITO_USER_POOLS' : 'NONE',
          authorizerId: authorizer ? cognitoAuthorizer.id : undefined,
        },
        {
          dependsOn: [this.restApi, this.resource, this.wildCardResource],
          parent: this.parent,
        },
      );

      const methodResponse = new aws.apigateway.MethodResponse(
        `${lambdaName}_method_response`,
        {
          restApi: this.restApi.id,
          resourceId: apiMethod.resourceId,
          httpMethod: apiMethod.httpMethod,
          statusCode: '200',
          responseModels: {
            'application/json': 'Empty',
          },
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
        },
        { parent: this.parent },
      );

      new aws.lambda.Permission(
        `${lambdaName}_permission`,
        {
          action: 'lambda:InvokeFunction',
          function: handler.name,
          principal: 'apigateway.amazonaws.com',
          sourceArn: pulumi.interpolate`${this.restApi.executionArn}${permission}`,
        },
        { parent: this.parent },
      );

      const integration = new aws.apigateway.Integration(
        `${lambdaName}_integration`,
        {
          restApi: this.restApi.id,
          resourceId: apiMethod.resourceId,
          httpMethod: apiMethod.httpMethod,
          type: 'AWS_PROXY',
          integrationHttpMethod: 'POST',
          uri: handler.invokeArn,
        },
        { dependsOn: [apiMethod, handler], parent: this.parent },
      );
      new aws.apigateway.IntegrationResponse(
        `${lambdaName}_integration_response`,
        {
          restApi: this.restApi.id,
          resourceId: apiMethod.resourceId,
          httpMethod: apiMethod.httpMethod,
          statusCode: methodResponse.statusCode,
          responseTemplates: {
            'application/json': '',
          },
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Headers':
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Methods':
              "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
          },
        },
        { parent: this.parent, dependsOn: [integration, methodResponse] },
      );
      deploymentDeps.push(integration);
    }
    return deploymentDeps;
  }
}
