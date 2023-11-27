import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import axios from 'axios';
import * as jose from 'node-jose';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  const { AWS_REGION, COGNITO_USER_POOL_ID, CONNECTIONS_TABLE_ID } =
    process.env;

  if (event.queryStringParameters == undefined)
    return context.fail('Unauthorized');
  const keys_url = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
  const {
    queryStringParameters: { token },
  } = event;
  if (token == undefined) return context.fail('Unauthorized');
  const sections = token.split('.');
  if (sections.length < 3) return context.fail('Unauthorized');

  let authHeader = jose.util.base64url.decode(sections[0]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  authHeader = JSON.parse(authHeader);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const kid = authHeader.kid;
  const response = await axios.get(keys_url);

  const keys = response.data['keys'];

  const foundKey = keys.find((key) => {
    return kid === key.kid;
  });

  if (!foundKey) {
    context.fail('Public key not found in jwks.json');
  }

  const results = async () => {
    return await new Promise((resolve, reject) => {
      jose.JWK.asKey(foundKey).then(async function (result) {
        // verify the signature
        const value = async () =>
          await jose.JWS.createVerify(result)
            .verify(token)
            .then(function (result) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const claims = JSON.parse(result.payload);
              if (claims != undefined) {
                return true;
              } else {
                return false;
              }
            })
            .catch((err) => {
              console.error(err);
              return false;
            });

        if ((await value()) == true) {
          return resolve('accept');
        } else {
          return reject('reject');
        }
      });
    });
  };

  const awaitedresults = await results();
  if (awaitedresults == 'reject') {
    callback('An error happened!');
  } else {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const connectionId = event.requestContext.connectionId;
    const putParams = {
      Item: {
        connectionId,
      },
      TableName: CONNECTIONS_TABLE_ID,
    };
    await dynamoDb.put(putParams).promise();

    return {
      statusCode: 200,
    };
  }
};
