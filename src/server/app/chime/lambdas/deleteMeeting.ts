import { LambdaResponse } from '@shared/types';
import { chimeService } from '.';

export const handler = async (): Promise<LambdaResponse> => {
  const chime = await chimeService();
  const data = await chime.deleteMeeting();
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
