import { LambdaResponse } from '@shared/types';
import { userService } from '.';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { UpdateUserDto, UserKeyDto } from '../user.dto';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<LambdaResponse> => {
  const user = await userService();
  const userParam: UpdateUserDto = JSON.parse(event.body);
  const key: UserKeyDto = { uid: event?.pathParameters?.uid };
  const data = await user.update(key, userParam);
  const body = JSON.stringify(data);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'OPTIONS, PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body,
  };
};
