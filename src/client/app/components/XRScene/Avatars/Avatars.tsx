import React, { useState, useEffect, useCallback } from "react";
import { YourAvatar } from "./YourAvatar";
import { cognitoStore, avatarStore, socketStore } from "../../../stores";
import { findCurrentUser } from "./utils";
import { UserData, getAllUsersData } from "../../../common";
import { OtherAvatars } from "./OtherAvatars";
import { PositionsType, UserDataPacket, UserMode } from "@shared/types";

export interface ActiveAvatar {
    username: string;
    image: string;
    avatar: string;
    userMode: UserMode;
}

export const Avatars = () => {
    const { cognito } = cognitoStore();
    const { userMode, avatar, otherUserAvatars, setOtherUserAvatars } = avatarStore();
    const [activeUserAvatar, setActiveUserAvatar] = useState<ActiveAvatar>();
    const { receivedSocketData } = socketStore();
    const [allUsersHttpData, setAllUsersHttpData] = useState<UserData[]>();

    const setupActiveUser = useCallback((allUsers: UserData[]) => {
        if (cognito && userMode) {
            const currentUser = allUsers.find(user => findCurrentUser(user, cognito.username))
            const activeAvatar: ActiveAvatar = {
                username: cognito.username,
                image: currentUser.image,
                avatar,
                userMode: userMode,
            };
            setActiveUserAvatar(activeAvatar);
        }
    }, [cognito, userMode, avatar])

    const setupUsers = useCallback(async () => {
        const data = await getAllUsersData(cognito);
        setupActiveUser(data)
        setAllUsersHttpData(data);
    }, [cognito, setupActiveUser]);

    useEffect(() => {
        setupUsers()
    }, [setupUsers]);

    const updateAvatarData = useCallback((userData: UserDataPacket) => {
        if (!userData) return;
        for (let x = 0; x < otherUserAvatars.length; x++) {
            if (userData.type === PositionsType.USERS && userData.uid === otherUserAvatars[x].uid) {
                otherUserAvatars.splice(x, 1);
            }
        }
        otherUserAvatars.push(userData)
        setOtherUserAvatars(otherUserAvatars);
    }, [otherUserAvatars, setOtherUserAvatars])

    useEffect(() => {
        updateAvatarData(receivedSocketData as UserDataPacket)
    }, [receivedSocketData, updateAvatarData])

    const renderOtherUserAvatars = otherUserAvatars && otherUserAvatars.length > 0 && allUsersHttpData && allUsersHttpData.length > 0;

    return (
        <>
            <>
                {renderOtherUserAvatars && (
                    <OtherAvatars socketData={otherUserAvatars} allUsersHttpData={allUsersHttpData} receivedSocketData={receivedSocketData as UserDataPacket} />
                )}
            </>
            <>
                {activeUserAvatar && (
                    <YourAvatar
                        username={cognito.username}
                        image={activeUserAvatar.image}
                        userMode={activeUserAvatar.userMode}
                        avatar={activeUserAvatar.avatar}
                    />
                )}
            </>
        </>
    );
};