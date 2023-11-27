import React, { useCallback, useEffect } from "react";
import { ARButton, Controllers, VRButton } from "@react-three/xr";
import { Device, deviceStore } from "../../stores";
import { Sockets } from "./Sockets";
import { Canvas } from "@react-three/fiber";
import { Avatars } from "./Avatars";
import { KeyboardControls } from "./KeyboardControls";
import { Camera } from "./Camera";
import { XR } from "@react-three/xr";
import { DEVICE } from "../../consts";

export const XRScene = (props) => {
    const { children } = props;
    const { device, setDevice } = deviceStore();

    const configureDevice = useCallback(async () => setDevice(await DEVICE), [setDevice]);

    useEffect(() => {
        configureDevice();
    }, [configureDevice]);

    return (
        <>
            {device === Device.WEB_AR && <ARButton />}
            {device === Device.WEB_VR && <VRButton />}
            <Canvas
                style={{
                    height: "100vh",
                    width: "100vw",
                }}
            >
                <Sockets>
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
                </Sockets>
            </Canvas>
        </>
    );
}