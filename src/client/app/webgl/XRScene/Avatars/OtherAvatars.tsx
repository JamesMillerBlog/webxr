import React, { useState, useEffect } from "react";
import { extractUserData } from "./utils";
import { AvatarController } from "./AvatarController";
import { Movement, UserMode, PositionData, UserDataPacket, User } from "@shared/types";
import { useAuthStore } from "../../../stores";

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

export const OtherAvatars = ({ avatars, allUsersHttpData, receivedSocketData }: { avatars: UserDataPacket[]; allUsersHttpData: User[]; receivedSocketData: UserDataPacket; }) => {
  const { auth } = useAuthStore();
  const [renderUserAvatars, setUserAvatarsToRender] = useState<UserAvatars[]>();

  useEffect(() => {
    const receivedAvatarIsValid = avatars.some(avatar => avatar.uid === receivedSocketData.uid);
    if (!receivedAvatarIsValid) return;
    const formattedAvatars: UserAvatars[] = avatars.map(({ uid, data }) => {
      const { userImage, userAvatar } = extractUserData(uid, allUsersHttpData);
      return {
        username: uid,
        image: userImage,
        avatar: userAvatar,
        userMode: data.userMode,
        movement: data.movement,
        body: data.body,
        leftHand: data.leftHand,
        rightHand: data.rightHand,
      };
    });


    for (let x = 0; x < formattedAvatars.length; x++) {
      const avatar = formattedAvatars[x];
      const avatarExists = receivedSocketData.uid === avatar.username;
      if (avatarExists) {
        avatar.body = receivedSocketData.data.body;
        avatar.leftHand = receivedSocketData.data.leftHand;
        avatar.rightHand = receivedSocketData.data.rightHand;
        avatar.userMode = receivedSocketData.data.userMode;
        avatar.movement = receivedSocketData.data.movement;
      }
    }

    setUserAvatarsToRender(formattedAvatars);
  }, [auth.username, allUsersHttpData, avatars, receivedSocketData]);

  return (
    <>
      {renderUserAvatars &&
        renderUserAvatars.length > 0 &&
        renderUserAvatars.map(({
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
