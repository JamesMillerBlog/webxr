"use client"
import { SignInState, useAuthStore } from "./stores";
import { deviceStore, avatarStore, Device } from "./webgl/stores";
import Header from "./components/Header";
import RpmPopUp from "./components/ReadyPlayerMe";
import { Shiba, Slide, Dome } from './webgl/Assets';
import { WebGL } from "./webgl/WebGL";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Login from "./components/Login";

export default function Page() {
    const { device } = deviceStore();
    const { showIFrame } = avatarStore();
    const { signInState } = useAuthStore();

    const { authStatus } = useAuthenticator((context) => [context.user]);

    if (signInState !== SignInState.SIGNED_IN || !authStatus) {
        return (
            <Login />
        )
    }

    return (
        <>
            <Header />
            {showIFrame ?
                <RpmPopUp /> :
                <WebGL>
                    <Shiba name={"shiba"} position={[1, 0, -3]} rotation={[0, 1, 0]} />
                    {device != Device.WEB_AR && (
                        <Dome name={"breakdown"} image={"space.jpg"} admin={true} />
                    )}
                    <Slide
                        name={"smile"}
                        image={"smile.jpeg"}
                        position={[-2, 0, -2]}
                        rotation={[0, 0, 0]}
                        width={1}
                        height={1}
                    />
                    <ambientLight intensity={1} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <spotLight position={[10, 10, 10]} angle={15} penumbra={1} />
                </WebGL>
            }
        </>
    );
}