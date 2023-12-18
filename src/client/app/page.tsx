"use client"
import { SignInState, useAuthStore } from "./stores";
import { deviceStore, Device, chimeStore } from "./webgl/stores";
import Header from "./components/Header";
import RpmPopUp from "./components/ReadyPlayerMe";
import { Dome, Shiba, Slide } from './webgl/Assets';
import { WebGL } from "./webgl/WebGL";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Login from "./components/Login";
import { useEffect, useState } from "react";

export default function Page() {
    const { device } = deviceStore();
    const {actions} = chimeStore()
    const { signInState } = useAuthStore();
    const [readyToEnter, setReadyToEnter] = useState(false)
    const [isHovered, setIsHovered] = useState(false);
    
    useEffect(() => {
        if(signInState !== SignInState.SIGNED_IN) setReadyToEnter(false)
    }, [signInState]);

    const { authStatus } = useAuthenticator((context) => [context.user]);

    if (signInState !== SignInState.SIGNED_IN || !authStatus) {
        return (
            <Login />
        )
    }

    if(!readyToEnter) {
        return (
            <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center'}} >
                <button style={{
                        backgroundColor: isHovered ? '#007d50' : '#00d084',
                        color: '#fff',
                        padding: '15px 30px',
                        fontSize: '1.2em',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'background-color 0.3s ease-in-out, transform 0.3s ease-in-out',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }} onClick={() => {
                        setReadyToEnter(true)
                        actions.activateChime(true)
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    Enter WebXR
                </button>  
            </div>
        )
    }

    return (
        <>
            <Header />
            <RpmPopUp />
            <WebGL>
                {device !== Device.WEB_AR && (
                    <Dome
                        name={"dome"}
                        image={"space.jpg"}
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        width={10}
                        height={10}
                    />
                )}
                <Shiba name={"shiba"} position={[1, 0, -3]} rotation={[0, 1, 0]} />
                <Slide
                    name={"smile"}
                    image={"smile.jpeg"}
                    position={[-2, 0, -2]}
                    rotation={[0, 0, 0]}
                    width={1}
                    height={1}
                />
                <ambientLight intensity={2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <spotLight position={[10, 10, 10]} angle={15} penumbra={1} />
            </WebGL>
        </>
    );
}