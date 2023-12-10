import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const region = process.env.AWS_REGION;
  const domainName = process.env.DOMAIN_NAME;
  const connectionsTableId = process.env.CONNECTIONS_TABLE_ID;
  const userTableId = process.env.USER_TABLE_ID;

  if (
    !userPoolId ||
    !region ||
    !domainName ||
    !connectionsTableId ||
    !userTableId
  ) {
    throw new Error('Required ENVS not provided');
  }

  return {
    userPoolId,
    region,
    domainName,
    connectionsTableId,
    userTableId,
  };
};
