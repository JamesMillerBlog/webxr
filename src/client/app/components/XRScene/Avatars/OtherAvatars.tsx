import React, { useState, useEffect, useCallback } from "react";
import { extractUserData } from "./utils";
import { AvatarController } from "./AvatarController";
import { cognitoStore } from "../../../stores";
import { UserData } from "../../../common";
import { Movement, UserMode, PositionData, UserDataPacket } from "@shared/types";

export interface UserAvatars {
  username: string;
  image: string;
  avatar: string;
  userMode: UserMode;
  movement: Movement;
  body: PositionData;
  leftHand: PositionData;
  rightHand: PositionData;
}

export const OtherAvatars = ({ socketData, allUsersHttpData, receivedSocketData }: { socketData: UserDataPacket[]; allUsersHttpData: UserData[]; receivedSocketData: UserDataPacket; }) => {
  const { cognito } = cognitoStore();
  const [getUserAvatars, setUserAvatars] = useState<UserAvatars[]>();

  const updateAvatarPositions = useCallback((receivedSocketData: UserDataPacket) => {
    if (!getUserAvatars) return;
    for (let x = 0; x < getUserAvatars.length; x++) {
      if (receivedSocketData.uid === getUserAvatars[x].username) {
        getUserAvatars[x].body = receivedSocketData.data.body;
        getUserAvatars[x].leftHand = receivedSocketData.data.leftHand;
        getUserAvatars[x].rightHand = receivedSocketData.data.rightHand;
        getUserAvatars[x].userMode = receivedSocketData.data.userMode;
        getUserAvatars[x].movement = receivedSocketData.data.movement;
      }
    }
    setUserAvatars(getUserAvatars);
  }, [getUserAvatars])

  useEffect(() => {
    const avatars: UserAvatars[] = socketData.map((message) => {
      const { userImage, userAvatar } = extractUserData(message.uid, allUsersHttpData);

      return {
        username: message.uid,
        image: userImage,
        avatar: userAvatar,
        userMode: message.data.userMode,
        movement: message.data.movement,
        body: message.data.body,
        leftHand: message.data.leftHand,
        rightHand: message.data.rightHand,
      };
    });

    const userAvatars = avatars.filter(
      (avatar) => avatar.username != cognito.username
    );

    setUserAvatars(userAvatars);
  }, [cognito.username, allUsersHttpData, socketData]);

  useEffect(() => {
    updateAvatarPositions(receivedSocketData)
  }, [receivedSocketData, updateAvatarPositions])

  return (
    <>
      {getUserAvatars &&
        getUserAvatars.length > 0 &&
        getUserAvatars.map(({
          body, leftHand, rightHand, username, image, avatar, userMode, movement
        }) => {
          return (
            <AvatarController
              body={body}
              leftHand={leftHand}
              rightHand={rightHand}
              key={username}
              image={image}
              avatar={avatar}
              userMode={userMode}
              movement={movement}
              activeUser={false}
            />
          )
        })}
    </>
  );
};
