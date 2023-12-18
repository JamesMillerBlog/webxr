import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { Server } from '../Server';
import { DOMAIN, STACK } from '../../../shared/infrastructure/common';
import { DomainName, Resource, RestApi } from '@pulumi/aws/apigateway';
import { Endpoint, Resources } from './RestLambda';
import { Authorizer } from '@pulumi/aws/apigateway/authorizer';

export interface LambdaResource {
  resource: Resource;
  wildCardResource: Resource;
  endpoints: Endpoint[];
  path: string;
}

export class RestApiGateway {
  domainName: DomainName;
  name: string;
  parent: Server;
  restApi: RestApi;

  constructor(
    parent: Server,
    name: string,
    resources: Resources[],
    edgeCertificationArn: string,
    cognitoUserPoolArn: string,
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

    this.domainName = new aws.apigateway.DomainName(
      `${name}_domain`,
      {
        certificateArn: edgeCertificationArn,
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
        providerArns: [cognitoUserPoolArn],
      },
      {
        parent,
      },
    );

    const lambdaResources: LambdaResource[] = this.setupResources(
      name,
      resources,
    );

    const lambdaIntegrations = this.setupEndpoints(
      lambdaResources,
      cognitoAuthorizer,
    );

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

    const deploymentDeps = [...lambdaIntegrations, ...gateway4xxResponses];

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

  setupMethods(
    endpoints: Endpoint[],
    wildCardResource: Resource,
    resource: Resource,
    cognitoAuthorizer: Authorizer,
    path: string,
  ) {
    return endpoints.map(({ method, handler, pathParams, authorizer }) => {
      const selectedResource = pathParams ? wildCardResource : resource;
      const resourceId = selectedResource.id;

      const permission = pathParams ? '/*/*/*' : '/*/*';

      const lambdaName = pathParams
        ? `${this.name}_${method}_${path}_path_params`
        : `${this.name}_${method}_${path}`;

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
          dependsOn: [this.restApi, resource, wildCardResource],
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

      return integration;
    });
  }

  setupEndpoints(
    lambdaResources: LambdaResource[],
    cognitoAuthorizer: Authorizer,
  ) {
    const deploymentDeps: pulumi.Input<pulumi.Resource>[] = [];

    for (const {
      endpoints,
      resource,
      wildCardResource,
      path,
    } of lambdaResources) {
      const methods = this.setupMethods(
        endpoints,
        wildCardResource,
        resource,
        cognitoAuthorizer,
        path,
      );
      methods.forEach((method) => deploymentDeps.push(method));
    }

    return deploymentDeps;
  }

  setupResources(name: string, resources: Resources[]) {
    return resources.map(({ path, endpoints }) => {
      const resourcePath = path.includes('/') ? path.replace('/', '_') : path;
      const resource = new aws.apigateway.Resource(
        `${name}_${resourcePath}_resource`,
        {
          restApi: this.restApi.id,
          parentId: this.restApi.rootResourceId,
          pathPart: path,
        },
        { parent: this.parent },
      );

      const wildCardResource = new aws.apigateway.Resource(
        `${name}_${resourcePath}_wildcardResource`,
        {
          restApi: this.restApi.id,
          parentId: resource.id,
          pathPart: '{uid+}',
        },
        { dependsOn: [resource], parent: this.parent },
      );

      return {
        resource,
        wildCardResource,
        endpoints,
        path: resourcePath,
      };
    });
  }
}
