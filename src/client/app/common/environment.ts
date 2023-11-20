export const checkEnvironmentVariables = () => {
  const envVariables = [
    { DOMAIN_NAME: process.env.NEXT_PUBLIC_DOMAIN_NAME },
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
    DOMAIN_NAME: String(process.env.NEXT_PUBLIC_DOMAIN_NAME),
    LOCAL_IP_ADDRESS: String(process.env.NEXT_PUBLIC_LOCAL_IP_ADDRESS),
    COGNITO_IDENTITY_POOL_ID: String(
      process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID
    ),
    COGNITO_USER_POOL_ID: String(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID),
    COGNITO_USER_POOL_CLIENT_ID: String(
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
    ),
    REGION: String(process.env.NEXT_PUBLIC_REGION),
    READY_PLAYER_ME: String(process.env.NEXT_PUBLIC_READY_PLAYER_ME),
    IS_LOCAL: process.env.NEXT_PUBLIC_LOCAL_IP_ADDRESS ? true : false,
  };
};
