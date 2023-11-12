import { Output } from "@pulumi/pulumi/output";

export interface ServerSecrets {
    COGNITO_IDENTITY_POOL_ID: Output<string>;
    COGNITO_USER_POOL_CLIENT_ID: Output<string>;
    COGNITO_USER_POOL_ID: Output<string>;
    CONNECTIONS_TABLE_ID: Output<string>;
    USERS_TABLE_ID: Output<string>;
    STAGE: string;
}

export interface ClientSecrets {
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: Output<string>;
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: Output<string>;
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: Output<string>;
    NEXT_PUBLIC_STAGE: string;
}

export interface Secrets {
    server: ServerSecrets;
    client: ClientSecrets;
}