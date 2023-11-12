import * as dotenv from 'dotenv';

const dotenvPath = `${__dirname}/../../.env.local`;
dotenv.config({ path: dotenvPath });

export const ENV = {
  variables: {
    SERVICE_NAME: String(process.env.SERVICE_NAME),
    COGNITO_USER_POOL_ID: String(process.env.COGNITO_USER_POOL_ID),
    COGNITO_USER_POOL_CLIENT_ID: String(
      process.env.COGNITO_USER_POOL_CLIENT_ID,
    ),
    COGNITO_AUTHORIZER: String(process.env.COGNITO_AUTHORIZER),
    COGNITO_USER_POOL_CLIENT_ARN: String(
      process.env.COGNITO_USER_POOL_CLIENT_ARN,
    ),
    API_GATEWAY_REST_API_ID: String(process.env.API_GATEWAY_REST_API_ID),
    API_GATEWAY_ROOT_RESOURCE_ID: String(
      process.env.API_GATEWAY_ROOT_RESOURCE_ID,
    ),
    STAGE: String(process.env.STAGE),
    REGION: String(process.env.REGION),
    ROOT_DOMAIN_NAME: String(process.env.ROOT_DOMAIN_NAME),
    DOMAIN_NAME: String(process.env.DOMAIN_NAME),
    API_LOCAL_IP_ADDRESS: String(process.env.API_LOCAL_IP_ADDRESS),
    LOCAL_API_REST_PORT: String(process.env.LOCAL_API_REST_PORT),
    LOCAL_API_WS_PORT: String(process.env.LOCAL_API_WS_PORT),
    CONNECTIONS_TABLE_ID: String(process.env.CONNECTIONS_TABLE_ID),
    POSITIONS_TABLE_ID: String(process.env.POSITIONS_TABLE_ID),
    USER_TABLE_ID: String(process.env.USER_TABLE_ID),
  },
};
