import { Shared } from "./Shared";
import { Server } from "./../../server/infrastructure"
import { Client } from "./../../client/infrastructure"
import { Secrets } from './types'

export const server = new Server();
export const client = new Client();

const { cognitoIdentityPoolId, cognitoUserPoolClientId, cognitoUserPoolId, socketConnectionsTableId, usersTableId } = server;

const secrets: Secrets = {
    client: {
        NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
        NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: cognitoUserPoolClientId,
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: cognitoUserPoolId,
    },
    server: {
        COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId,
        COGNITO_USER_POOL_CLIENT_ID: cognitoUserPoolClientId,
        COGNITO_USER_POOL_ID: cognitoUserPoolId,
        CONNECTIONS_TABLE_ID: socketConnectionsTableId,
        USERS_TABLE_ID: usersTableId
    }
}

export const shared = new Shared(secrets);