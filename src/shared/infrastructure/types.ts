import { Output } from "@pulumi/pulumi/output";

export interface ServerSecrets {
    COGNITO_USER_POOL_CLIENT_ID: Output<string>;
    COGNITO_USER_POOL_ID: Output<string>;
    CONNECTIONS_TABLE_ID: Output<string>;
    USER_TABLE_ID: Output<string>;
    REGION: string;
    DOMAIN_NAME: string;
}

export interface ClientSecrets {
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: Output<string>;
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: Output<string>;
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: Output<string>;
    NEXT_PUBLIC_DOMAIN_NAME: string;
    NEXT_PUBLIC_REGION: string;
    NEXT_PUBLIC_READY_PLAYER_ME: string;
}

export interface Secrets {
    server: ServerSecrets;
    client: ClientSecrets;
}