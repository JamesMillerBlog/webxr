// import React, { useState, useEffect, useCallback } from "react";
import React, { useState, useEffect, useCallback } from "react";
// import useSocketIO, { ReadyState } from "react-use-websocket";
import { movementStore, socketStore, cognitoStore, positionsStore, avatarStore } from "../../stores";
import { IS_LIVE, WS_API_URL } from "../../common";
import { useFrame } from "@react-three/fiber";
// import { JsonValue, JsonPrimitive } from "react-use-websocket/dist/lib/types";
import { io } from 'socket.io-client';
import { UserDataPacket, PositionsType, DataPacket } from "@shared/types";
// import { IoProvider } from 'socket.io-react-hook';
// import { useSocket, useSocketEvent } from 'socket.io-react-hook';

export const Sockets = (props) => {
    const { children } = props;
    const { cognito } = cognitoStore();
    const [trigger, setTrigger] = useState(false);
    const [frames, setFrames] = useState(0);

    const url = IS_LIVE ? `${WS_API_URL}?token=${cognito.jwt}` : WS_API_URL;
    const { positions } = positionsStore();
    const { movement } = movementStore();
    const { userMode } = avatarStore();
    const { socketIO, setSocketIO, setReceivedSocketData } = socketStore();
    const [isConnected, setIsConnected] = useState(false);
    const [newDataToSubmit, setNewDataToSubmit] = useState(false);

    if (!socketIO) {
        const socket = io(url, { transports: ['websocket', 'polling', 'flashsocket'] });
        setSocketIO(socket)
    }

    const submitPositions = useCallback(() => {
        const packet: UserDataPacket = {
            type: PositionsType.USERS,
            uid: cognito.username,
            data: { ...positions, movement, userMode },
        };
        socketIO.emit("positions", packet)
        setNewDataToSubmit(false);
    }, [cognito.username, movement, positions, socketIO, userMode])

    const onConnect = useCallback(() => setIsConnected(true), [setIsConnected])
    const onDisconnect = useCallback(() => setIsConnected(false), [setIsConnected])
    const onPositions = useCallback((packet: DataPacket) => {
        if (packet.uid === cognito.username) return
        setReceivedSocketData(packet)
    }, [cognito.username, setReceivedSocketData])

    useFrame(() => {
        setFrames(frames + 1);
        if (frames % 15 === 0 && isConnected) {
            setTrigger(true);
        }
    });

    useEffect(() => {
        const shouldSendData = trigger && isConnected && newDataToSubmit;

        if (shouldSendData) submitPositions()
        if (trigger) setTrigger(false);
    }, [isConnected, newDataToSubmit, submitPositions, trigger]);

    useEffect(() => {
        if (!socketIO) return;
        socketIO.on('connect', onConnect);
        socketIO.on('disconnect', onDisconnect);
        socketIO.on('positions', onPositions);

        if (socketIO.active) onConnect();
        else onDisconnect();

        return () => {
            socketIO.off('connect', onConnect);
            socketIO.off('disconnect', onDisconnect);
        };
    }, [onConnect, onDisconnect, onPositions, socketIO]);


    useEffect(() => {
        if (isConnected) setNewDataToSubmit(true);
    }, [isConnected, movement, positions, setNewDataToSubmit]);

    return <>{children}</>;
}