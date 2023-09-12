import { checkEnvironmentVariables } from "./environment";

export const ENV = checkEnvironmentVariables();
export const {
  COGNITO_IDENTITY_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
  DOMAIN_NAME,
  READY_PLAYER_ME,
  REGION,
  ROOT_DOMAIN_NAME,
  STAGE,
  IS_LIVE,
  LOCAL_API_REST_PORT,
  API_LOCAL_IP_ADDRESS,
  LOCAL_API_WS_PORT,
} = ENV;

export const WS_LOCAL_URL = `wss://${API_LOCAL_IP_ADDRESS}:${LOCAL_API_WS_PORT}`;
// export const HTTP_LOCAL_URL = `https://${API_LOCAL_IP_ADDRESS}:${LOCAL_API_REST_PORT}/${STAGE}`;
export const HTTP_LOCAL_URL = `https://${API_LOCAL_IP_ADDRESS}:${LOCAL_API_REST_PORT}`;

export const HTTP_LIVE_URL = `https://api.${DOMAIN_NAME}`;
export const WS_LIVE_URL = `wss://ws.${DOMAIN_NAME}`;

export const HTTP_API_URL = IS_LIVE ? HTTP_LIVE_URL : HTTP_LOCAL_URL;
// export const HTTP_API_URL = HTTP_LIVE_URL;
export const WS_API_URL = IS_LIVE ? WS_LIVE_URL : WS_LOCAL_URL;
// export const WS_API_URL = WS_LIVE_URL;
