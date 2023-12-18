import { LambdaResponse } from '@shared/types';
import { chimeService } from '.';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DeleteChimeAttendeDto } from '../chime.dto';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<LambdaResponse> => {
  const chime = await chimeService();
  const chimeParam: DeleteChimeAttendeDto = JSON.parse(event.body);
  const data = await chime.deleteAttendee(chimeParam.attendeeId);
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
