'use strict';
import { get } from '../utils';

export const handler = async (event: { query: { uuid: string } }) => {
  const data = await get(event.query.uuid, process.env.USERS_TABLE_ID);
  const body = JSON.stringify(data);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body,
  };
};
