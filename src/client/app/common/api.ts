import axios from "axios";
import { Cognito } from "../stores";
import { HTTP_API_URL } from "./consts";
import { User, UserMode } from "@shared/types";

export const getUserData = async (cognito: Cognito): Promise<User> =>
  await axios({
    method: "get",
    url: `${HTTP_API_URL}/user/${cognito.username}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cognito.jwt}`,
    },
  })
    .then(({ data }) => data)
    .catch((e) => {
      console.error(e);
    });

export const createUserData = async (cognito: Cognito): Promise<User> =>
  await axios({
    method: "post",
    url: `${HTTP_API_URL}/user`,
    data: {
      uid: cognito.username,
      avatar: "",
      role: "",
      image: "jamesmiller.png",
      userMode: UserMode.IMAGE,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cognito.jwt}`,
    },
  })
    .then(({ data }) => data)
    .catch((e) => {
      console.error(e);
    });

export const updateUserData = async (
  cognito: Cognito,
  userMode: UserMode,
  avatar: string
) => {
  const data = {
    userMode,
    avatar,
    image: "jamesmiller.png",
  };

  return await axios({
    method: "put",
    url: `${HTTP_API_URL}/user/${cognito.username}`,
    data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cognito.jwt}`,
    },
  }).then(
    ({ data }) => data,
    (error) => error
  );
};

export const getAllUsersData = async (cognito: Cognito): Promise<User[]> =>
  await axios({
    method: "get",
    url: `${HTTP_API_URL}/user/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cognito.jwt}`,
    },
  }).then(
    ({ data }) => data,
    (error) => console.log(error)
  );
