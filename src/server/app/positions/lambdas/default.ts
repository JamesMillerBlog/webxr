import { UserDataPacket } from '@shared/types';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { CONNECTIONS_TABLE_ID, DOMAIN_NAME } = process.env;

export const handler = async (event: APIGatewayProxyEvent) => {
  const socketUrl = `https://ws.${DOMAIN_NAME}`;

  const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: socketUrl,
  });

  const connectionId = event.requestContext.connectionId;

  const data: UserDataPacket = JSON.parse(event.body)?.data;

  await broadcastMessage(connectionId, data, apiGatewayManagementApi);

  return {
    statusCode: 200,
  };
};

async function broadcastMessage(
  senderConnectionId: string,
  positionData: UserDataPacket,
  apiGatewayManagementApi: AWS.ApiGatewayManagementApi,
) {
  const connections = await getAllConnections();

  await Promise.all(
    connections.Items.map(async (connection) => {
      const connectionId = connection.connectionId;

      if (connectionId !== senderConnectionId) {
        try {
          await apiGatewayManagementApi
            .postToConnection({
              ConnectionId: connectionId,
              Data: JSON.stringify(positionData),
            })
            .promise();
        } catch (error) {
          console.error(
            'Failed to send message to connection',
            connectionId,
            error,
          );
        }
      }
    }),
  );
}

const getAllConnections = async () =>
  await dynamoDb
    .scan({
      TableName: CONNECTIONS_TABLE_ID,
    })
    .promise();
