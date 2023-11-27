import { ConfigObject } from '@nestjs/config';

export default (): ConfigObject => {
  return {
    userPoolId: String(process.env.COGNITO_USER_POOL_ID),
    region: String(process.env.AWS_REGION),
    domainName: String(process.env.DOMAIN_NAME),
    connectionsTableId: String(process.env.CONNECTIONS_TABLE_ID),
    userTableId: String(process.env.USER_TABLE_ID),
  };
};
