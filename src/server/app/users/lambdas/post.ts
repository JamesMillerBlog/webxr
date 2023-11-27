import { LambdaResponse } from '@shared/types';
import { userService } from '.';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { UserDto } from '../user.dto';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<LambdaResponse> => {
  const user = await userService();
  const userParam: UserDto = JSON.parse(event.body);
  const data = await user.create(userParam);
  const body = JSON.stringify(data);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body,
  };
};
