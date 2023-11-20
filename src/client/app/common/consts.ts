import { checkEnvironmentVariables } from "./environment";

export const ENV = checkEnvironmentVariables();
export const {
  COGNITO_IDENTITY_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
  DOMAIN_NAME,
  READY_PLAYER_ME,
  REGION,
  IS_LOCAL,
  LOCAL_IP_ADDRESS,
} = ENV;

export const WS_LOCAL_URL = `wss://${LOCAL_IP_ADDRESS}:3002`;
export const HTTP_LOCAL_URL = `https://${LOCAL_IP_ADDRESS}:3002`;

export const HTTP_LIVE_URL = `https://api.${DOMAIN_NAME}`;
export const WS_LIVE_URL = `wss://ws.${DOMAIN_NAME}`;

export const HTTP_API_URL = IS_LOCAL ? HTTP_LOCAL_URL : HTTP_LIVE_URL;
export const WS_API_URL = IS_LOCAL ? WS_LOCAL_URL : WS_LIVE_URL;
