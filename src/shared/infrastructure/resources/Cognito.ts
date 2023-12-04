import * as aws from '@pulumi/aws';
import { Shared } from '../Shared';
import * as pulumi from '@pulumi/pulumi';

export class Cognito {
  userPoolId: pulumi.Output<string>;
  userPoolClientId: pulumi.Output<string>;
  userPoolArn: pulumi.Output<string>;
  identityPoolId: pulumi.Output<string>;

  constructor(name: string, parent: Shared) {
    const pool = new aws.cognito.UserPool(
      `${name}_pool`,
      {
        name: `${name}_pool`,
        passwordPolicy: {
          minimumLength: 8,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: true,
          requireUppercase: true,
        },
        autoVerifiedAttributes: ['email'],
        accountRecoverySetting: {
          recoveryMechanisms: [
            {
              name: 'verified_email',
              priority: 1,
            },
            {
              name: 'verified_phone_number',
              priority: 2,
            },
          ],
        },
      },
      { parent },
    );

    const client = new aws.cognito.UserPoolClient(
      `${name}_userpool_client`,
      {
        name: `${name}_userpool_client`,
        generateSecret: false,
        userPoolId: pool.id,
      },
      { parent },
    );

    new aws.cognito.User(
      `${name}_initial_user`,
      {
        userPoolId: pool.id,
        username: 'test@test.com',
        attributes: {
          email: 'test@test.com',
          email_verified: 'true',
        },
        password: 'Test1234!',
      },
      { parent },
    );

    const authenticatedRole = new aws.iam.Role(
      `${name}_auth_role`,
      {
        name: `${name}_auth_role`,
        assumeRolePolicy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                Federated: 'cognito-identity.amazonaws.com',
              },
              Action: 'sts:AssumeRoleWithWebIdentity',
              Condition: {
                StringEquals: {
                  'cognito-identity.amazonaws.com:aud': pool.id,
                },
              },
            },
          ],
        }),
      },
      { parent },
    );

    new aws.iam.RolePolicy(
      `${name}_auth_policy`,
      {
        name: `${name}_auth_policy`,
        role: authenticatedRole.id,
        policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['mobileanalytics:PutEvents', 'cognito-sync:*'],
              Resource: ['*'],
            },
          ],
        }),
      },
      { parent },
    );

    const identityPool = new aws.cognito.IdentityPool(
      `${name}_identity_pool`,
      {
        identityPoolName: `${name}_identity_pool`,
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            clientId: client.id,
            providerName: pool.endpoint,
          },
        ],
      },
      { parent },
    );

    new aws.cognito.IdentityPoolRoleAttachment(
      `${name}_identity_pool_role_attachment`,
      {
        identityPoolId: identityPool.id,
        roles: { authenticated: authenticatedRole.arn },
      },
      { parent },
    ),
      { parent };
    this.userPoolId = pool.id;
    this.userPoolClientId = client.id;
    this.userPoolArn = pool.arn;
    this.identityPoolId = identityPool.id;
  }
}
