import React, { ReactNode, useState } from "react";
import { Controllers } from "@react-three/xr";
import { useSocketStore } from "../../stores";
import { Device, deviceStore } from "../../webgl/stores";
import { useFrame } from "@react-three/fiber";
import { Avatars } from "./Avatars";
import { KeyboardControls } from "./KeyboardControls";
import { Camera } from "./Camera";
import { XR } from "@react-three/xr";

export const XRScene = ({ children }: { children: ReactNode; }) => {
    const { isConnected, actions } = useSocketStore();
    const { device } = deviceStore();

    const [frames, setFrames] = useState(0);

    useFrame(() => {
        if (!isConnected) return

        setFrames(frames + 1);
        if (frames % 15 === 0) actions.submitDataToWebSocket(true);
    });

    return (
        <>
            <XR referenceSpace="local">
                <Avatars />
                {device != undefined && device === Device.WEB && (
                    <>
                        <KeyboardControls>
                            <Camera
                                fov={65}
                                aspect={window.innerWidth / window.innerHeight}
                                radius={1000}
                            />
                        </KeyboardControls>
                        {children}
                    </>
                )}
                {device != undefined && device !== Device.WEB && (
                    <>
                        <Controllers />
                        <Camera
                            fov={65}
                            aspect={window.innerWidth / window.innerHeight}
                            radius={1000}
                            posCorrection={device === Device.WEB_AR ? 0 : 1.2}
                        />
                        {children}
                    </>
                )}
            </XR>
        </>
    );
}