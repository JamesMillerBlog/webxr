import { User } from '@shared/types';
import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getUser = async (
  uid: string,
  usersTable: string,
): Promise<User> => {
  const users = await dynamoDb.scan({ TableName: usersTable }).promise();
  let chosenUser;
  for (let x = 0; x < users.Items.length; x++) {
    if (users.Items[x].uid == uid) {
      chosenUser = users.Items[x];
    }
  }
  return chosenUser;
};

export const get = async (uuid: string, usersTable: string) => {
  if (uuid) {
    const putParams = {
      Item: {
        uid: uuid,
        role: null,
        avatar: null,
        userMode: 'image',
        username: uuid,
        image: 'jamesmiller.png',
      },
      TableName: usersTable,
    };

    const putUserData = () => dynamoDb.put(putParams).promise();
    const userDetails = await getUser(uuid, usersTable);
    if (!userDetails) await putUserData();

    return getUser(uuid, usersTable);
  } else {
    return dynamoDb.scan({ TableName: usersTable }).promise();
  }
};
