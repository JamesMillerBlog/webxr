import React, { useState, useEffect, useCallback } from "react";
import { YourAvatar } from "./YourAvatar";
import { avatarStore } from "../../../webgl/stores";
import { useAuthStore, useSocketStore } from "../../../stores";
import { findCurrentUser } from "./utils";
import { getAllUsersData } from "../../../common";
import { OtherAvatars } from "./OtherAvatars";
import { PositionsType, User, UserDataPacket, UserMode } from "@shared/types";

export interface ActiveAvatar {
    username: string;
    image: string;
    avatar: string;
    userMode: UserMode;
}

export const Avatars = () => {
    const { auth } = useAuthStore();
    const { userMode, avatar, otherUserAvatars, setOtherUserAvatars } = avatarStore();
    const [activeUserAvatar, setActiveUserAvatar] = useState<ActiveAvatar>();
    const { receivedSocketData } = useSocketStore();
    const [allUsersHttpData, setAllUsersHttpData] = useState<User[]>();

    const setupActiveUser = useCallback((allUsers: User[]) => {
        if (auth && userMode) {

            const currentUser = allUsers.find(user => findCurrentUser(user, auth.username))

            const activeAvatar: ActiveAvatar = {
                username: auth.username,
                image: currentUser.image,
                avatar,
                userMode: userMode,
            };
            setActiveUserAvatar(activeAvatar);
        }
    }, [auth, userMode, avatar])

    const setupUsers = useCallback(async () => {
        const data = await getAllUsersData(auth);
        setupActiveUser(data)
        setAllUsersHttpData(data);
    }, [auth, setupActiveUser]);

    useEffect(() => {
        setupUsers()
    }, [setupUsers]);

    const updateAvatarData = useCallback((userData: UserDataPacket) => {
        if (!userData) return;
        for (let x = 0; x < otherUserAvatars.length; x++) {
            const avatarExistsInAppMemory = userData.type === PositionsType.USERS && userData.uid === otherUserAvatars[x].uid;
            if (avatarExistsInAppMemory) otherUserAvatars.splice(x, 1);
        }
        otherUserAvatars.push(userData)
        setOtherUserAvatars(otherUserAvatars);
    }, [otherUserAvatars, setOtherUserAvatars])

    const checkOtherAvatarsUserData = useCallback((userDataPacket: UserDataPacket) => {
        if (!allUsersHttpData || !userDataPacket) return false;
        const userExistsOnFirstTry = allUsersHttpData.find(user => user.uid === userDataPacket.uid);
        if (userExistsOnFirstTry) return true;
        setupUsers()
        const userExistsOnSecondTry = allUsersHttpData.find(user => user.uid === userDataPacket.uid);
        return !userExistsOnSecondTry ? false : true;
    }, [allUsersHttpData, setupUsers])

    useEffect(() => {
        const userDataPacket = receivedSocketData as UserDataPacket;
        const userHttpDataExists = checkOtherAvatarsUserData(userDataPacket);
        if (userHttpDataExists) updateAvatarData(userDataPacket)
    }, [receivedSocketData, updateAvatarData, checkOtherAvatarsUserData])

    const renderOtherUserAvatars = otherUserAvatars && otherUserAvatars.length > 0 && allUsersHttpData && allUsersHttpData.length > 0;

    return (
        <>
            <>
                {renderOtherUserAvatars && (
                    <OtherAvatars avatars={otherUserAvatars} allUsersHttpData={allUsersHttpData} receivedSocketData={receivedSocketData as UserDataPacket} />
                )}
            </>
            <>
                {activeUserAvatar && (
                    <YourAvatar
                        username={auth.username}
                        image={activeUserAvatar.image}
                        userMode={activeUserAvatar.userMode}
                        avatar={activeUserAvatar.avatar}
                    />
                )}
            </>
        </>
    );
};