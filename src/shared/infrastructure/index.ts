import { Shared } from "./Shared";
import { Server } from "./../../server/infrastructure"
import { Client } from "./../../client/infrastructure"
import { Secrets } from './types'
import { STACK } from "./common";
import { DOMAIN } from "./common";
import * as crypto from 'crypto';

const deploymentVersion = crypto.randomBytes(10).toString('hex')

export const shared = new Shared();

const edgeCert = shared.acm(true, DOMAIN);
const regionalCert = shared.acm(false, `ws.${DOMAIN}`);
// const regionalCert = shared.acm(false, `api.${DOMAIN}`, edgeCert);

export const client = new Client(edgeCert, deploymentVersion);

export const server = new Server(edgeCert, regionalCert, deploymentVersion);

const { cognitoIdentityPoolId, cognitoUserPoolClientId, cognitoUserPoolId, socketConnectionsTableId, usersTableId } = server;
const secrets: Secrets = {
    client: {
        NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
        NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: cognitoUserPoolClientId,
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: cognitoUserPoolId,
        NEXT_PUBLIC_STAGE: STACK
    },
    server: {
        COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
        COGNITO_USER_POOL_CLIENT_ID: cognitoUserPoolClientId,
        COGNITO_USER_POOL_ID: cognitoUserPoolId,
        CONNECTIONS_TABLE_ID: socketConnectionsTableId,
        USERS_TABLE_ID: usersTableId,
        STAGE: STACK
    }
}

shared.secretsManager(secrets);