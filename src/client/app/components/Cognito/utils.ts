import { Amplify } from "aws-amplify";
import {
  COGNITO_IDENTITY_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
  REGION,
} from "../../common";
import { Cognito } from "../../stores";
import { createUserData, getUserData } from "../../common";
import { UserMode } from "@shared/types";

export function setupAmplify() {
  Amplify.configure({
    Auth: {
      identityPoolId: COGNITO_IDENTITY_POOL_ID,
      region: REGION,
      userPoolId: COGNITO_USER_POOL_ID,
      userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
    },
  });
}

export interface UserCredentials {
  accessToken: {
    payload: {
      "cognito:groups": string;
      username: string;
    };
  };
  idToken: {
    jwtToken: string;
  };
}

export const configureUserData = (user: UserCredentials) => {
  const { accessToken, idToken } = user;
  const role = accessToken.payload["cognito:groups"];
  const token = {
    jwt: idToken.jwtToken,
    role: role ? role[0] : "",
    username: accessToken.payload.username,
  };
  return token;
};

export const setupUser = async (
  cognito: Cognito,
  userMode: UserMode,
  avatar: string
) => {
  const existingUser = await getUserData(cognito);
  const user = existingUser ? existingUser : await createUserData(cognito);
  const selectedUserMode = userMode ? userMode : user.userMode;
  const selectedAvatar = avatar ? avatar : user.avatar;
  return { selectedAvatar, selectedUserMode, user };
};
