export const checkEnvironmentVariables = () => {
  const envVariables = [
    { STAGE: process.env.NEXT_PUBLIC_STAGE },
    { ROOT_DOMAIN_NAME: process.env.NEXT_PUBLIC_ROOT_DOMAIN_NAME },
    { DOMAIN_NAME: process.env.NEXT_PUBLIC_DOMAIN_NAME },
    { API_LOCAL_IP_ADDRESS: process.env.NEXT_PUBLIC_API_LOCAL_IP_ADDRESS },
    { LOCAL_API_REST_PORT: process.env.NEXT_PUBLIC_LOCAL_API_REST_PORT },
    { LOCAL_API_WS_PORT: process.env.NEXT_PUBLIC_LOCAL_API_WS_PORT },
    {
      COGNITO_IDENTITY_POOL_ID:
        process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
    },
    { COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID },
    {
      COGNITO_USER_POOL_CLIENT_ID:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
    },
    { REGION: process.env.NEXT_PUBLIC_REGION },
    { READY_PLAYER_ME: process.env.NEXT_PUBLIC_READY_PLAYER_ME },
    { IS_LIVE: process.env.NEXT_PUBLIC_IS_LIVE },
  ];

  const missingVars: string[] = [];

  envVariables.forEach((env) => {
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(`Missing following env vars: ${missingVars}`);
  }

  return {
    STAGE: String(process.env.NEXT_PUBLIC_STAGE),
    ROOT_DOMAIN_NAME: String(process.env.NEXT_PUBLIC_ROOT_DOMAIN_NAME),
    DOMAIN_NAME: String(process.env.NEXT_PUBLIC_DOMAIN_NAME),
    API_LOCAL_IP_ADDRESS: String(process.env.NEXT_PUBLIC_API_LOCAL_IP_ADDRESS),
    LOCAL_API_REST_PORT: String(process.env.NEXT_PUBLIC_LOCAL_API_REST_PORT),
    LOCAL_API_WS_PORT: String(process.env.NEXT_PUBLIC_LOCAL_API_WS_PORT),
    COGNITO_IDENTITY_POOL_ID: String(
      process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID
    ),
    COGNITO_USER_POOL_ID: String(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID),
    COGNITO_USER_POOL_CLIENT_ID: String(
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
    ),
    REGION: String(process.env.NEXT_PUBLIC_REGION),
    READY_PLAYER_ME: String(process.env.NEXT_PUBLIC_READY_PLAYER_ME),
    IS_LIVE: process.env.NEXT_PUBLIC_IS_LIVE === "true" ? true : false,
  };
};
