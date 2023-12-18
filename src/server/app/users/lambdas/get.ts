import { APIGatewayProxyEvent } from 'aws-lambda';
import { userService } from '.';
import { LambdaResponse } from '@shared/types';

export interface GetParams extends APIGatewayProxyEvent {
  pathParameters: { uid?: string };
}

export const handler = async (event: GetParams): Promise<LambdaResponse> => {
  const user = await userService();
  const uid = event?.pathParameters?.uid;
  const data = uid ? await user.findOne({ uid }) : await user.findAll();
  const body = JSON.stringify(data);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'OPTIONS, GET',
    },
    body,
  };
};
