import { ReactNode, useCallback, useEffect } from "react"
import { XRScene } from "./XRScene"
import { createUserData, getUserData, updateUserData } from "../common";
import { Cognito, useAuthStore } from "../stores";
import { avatarStore, userStore } from "../webgl/stores";
import { UserMode } from "@shared/types";
import { Canvas } from "@react-three/fiber";

export const WebGL = ({ children }: { children: ReactNode }) => {
    const { auth } = useAuthStore();
    const { avatar, userMode, setUserMode, setAvatar } = avatarStore();
    const { setUser } = userStore();

    const init = useCallback(async () => {
        try {
            const { selectedAvatar, selectedUserMode, user } = await setupUser(auth, userMode, avatar)
            if (selectedAvatar) setAvatar(selectedAvatar);
            setUserMode(selectedUserMode);
            setUser(user);
            await updateUserData(auth, selectedUserMode, selectedAvatar);
        } catch (e) {
            console.error(e);
        }
    }, [auth, userMode, avatar, setAvatar, setUserMode, setUser]);

    useEffect(() => {
        init();
    }, [init]);

    return (
        <Canvas
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <XRScene>
                {children}
            </XRScene>
        </Canvas>
    )
}

const setupUser = async (
    auth: Cognito,
    userMode: UserMode,
    avatar: string
) => {
    const existingUser = await getUserData(auth);
    const user = existingUser ? existingUser : await createUserData(auth);
    const selectedUserMode = userMode ? userMode : user.userMode;
    const selectedAvatar = avatar ? avatar : user.avatar;
    return { selectedAvatar, selectedUserMode, user };
};
