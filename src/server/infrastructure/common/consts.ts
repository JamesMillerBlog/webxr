import * as dotenv from 'dotenv';

const dotenvPath = `${__dirname}/../../.env.local`;
dotenv.config({ path: dotenvPath });

export const ENV = {
  variables: {
    COGNITO_USER_POOL_ID: String(process.env.COGNITO_USER_POOL_ID),
    REGION: String(process.env.REGION),
    CONNECTIONS_TABLE_ID: String(process.env.CONNECTIONS_TABLE_ID),
    USER_TABLE_ID: String(process.env.USER_TABLE_ID),
    DOMAIN_NAME: String(process.env.DOMAIN_NAME),
  },
};
