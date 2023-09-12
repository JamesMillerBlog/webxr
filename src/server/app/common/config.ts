import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => {
  const isLive = process.env.IS_LIVE === 'true' ? true : false;
  return {
    serviceName: String(process.env.SERVICE_NAME),
    cognito: {
      userPoolId: String(process.env.COGNITO_USER_POOL_ID),
      userPoolClientId: String(process.env.COGNITO_USER_POOL_CLIENT_ID),
      authorizer: String(process.env.COGNITO_AUTHORIZER),
      userPoolClientArn: Number(process.env.COGNITO_USER_POOL_CLIENT_ARN),
    },
    apiGateway: {
      restApiId: String(process.env.API_GATEWAY_REST_API_ID),
      rootResourceId: String(process.env.API_GATEWAY_ROOT_RESOURCE_ID),
    },
    live: {
      stage: String(process.env.STAGE),
      region: String(process.env.REGION),
      rootDomainName: String(process.env.ROOT_DOMAIN_NAME),
      domainName: String(process.env.DOMAIN_NAME),
      httpLiveUrl: `https://${String(process.env.DOMAIN_NAME)}`,
      wsLiveUrl: `wss://ws.${String(process.env.DOMAIN_NAME)}`,
    },
    local: {
      ipAddress: String(process.env.API_LOCAL_IP_ADDRESS),
      restPort: String(process.env.LOCAL_API_REST_PORT),
      wsPort: String(process.env.LOCAL_API_WS_PORT),
      wsLocalUrl: `wss://${String(process.env.API_LOCAL_IP_ADDRESS)}:${String(
        process.env.LOCAL_API_WS_PORT,
      )}/${String(process.env.STAGE)}`,
      httpLocalUrl: `https://${String(
        process.env.API_LOCAL_IP_ADDRESS,
      )}:${String(process.env.LOCAL_API_REST_PORT)}/${String(
        process.env.STAGE,
      )}`,
    },
    connectionsTableId: String(process.env.CONNECTIONS_TABLE_ID),
    positionsTableId: String(process.env.POSITIONS_TABLE_ID),
    userTableId: String(process.env.USER_TABLE_ID),
    isLive,
    httpApiUrl: isLive
      ? `https://${String(process.env.DOMAIN_NAME)}`
      : `https://${String(process.env.API_LOCAL_IP_ADDRESS)}:${String(
          process.env.LOCAL_API_REST_PORT,
        )}/${String(process.env.STAGE)}`,
    wsApiUrl: isLive
      ? `wss://ws.${String(process.env.DOMAIN_NAME)}`
      : `wss://${String(process.env.API_LOCAL_IP_ADDRESS)}:${String(
          process.env.LOCAL_API_WS_PORT,
        )}/${String(process.env.STAGE)}`,
  };
};
