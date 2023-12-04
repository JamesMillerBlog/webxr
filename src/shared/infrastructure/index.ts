import { Shared, SharedResources } from './Shared';
import { Secrets } from './types';
import { DOMAIN } from './common';
import * as crypto from 'crypto';

const deploymentVersion = crypto.randomBytes(10).toString('hex');

export const shared = new Shared();

const edgeCert = shared.acm(true, DOMAIN);
const regionalCert = shared.acm(false, `ws.${DOMAIN}`);

const usersTable = shared.dynamoDb('users_table', 'uid', 'S');
const connectionsTable = shared.dynamoDb(
  'connections_table',
  'connectionId',
  'S',
);
const cognito = shared.cognito();

const secrets: Secrets = {
  client: {
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: cognito.identityPoolId,
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: cognito.userPoolClientId,
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: cognito.userPoolId,
  },
  server: {
    COGNITO_USER_POOL_CLIENT_ID: cognito.userPoolClientId,
    COGNITO_USER_POOL_ID: cognito.userPoolId,
    CONNECTIONS_TABLE_ID: connectionsTable.id,
    USER_TABLE_ID: usersTable.id,
  },
};

shared.secretsManager(secrets);

const sharedResources: SharedResources = {
  deploymentVersion,
  edgeCertificationArn: edgeCert.certificateArn,
  regionalCertificateArn: regionalCert.certificateArn,
  cognitoUserPoolArn: cognito.userPoolArn,
};

shared.output(sharedResources);
