import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log('Disconnect function invoked');
  const connectionId = event.requestContext.connectionId;
  console.log(`connectionid is the ${connectionId}`);

  const param = {
    Key: {
      connectionId,
    },
    TableName: process.env.CONNECTIONS_TABLE_ID,
  };

  await dynamoDb.delete(param).promise();
  console.log(`${connectionId} is deleted`);
  return {
    statusCode: 200,
  };
};
