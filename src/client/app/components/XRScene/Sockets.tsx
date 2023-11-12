import React, { useState, useEffect, useCallback } from "react";
import { movementStore, socketStore, cognitoStore, positionsStore, avatarStore } from "../../stores";
import { WS_API_URL } from "../../common";
import { useFrame } from "@react-three/fiber";
import { UserDataPacket, PositionsType, DataPacket } from "@shared/types";

export const Sockets = (props) => {
    const { children } = props;
    const { cognito } = cognitoStore();
    const [trigger, setTrigger] = useState(false);
    const [frames, setFrames] = useState(0);

    const url = `${WS_API_URL}?token=${cognito.jwt}`
    const { positions } = positionsStore();
    const { movement } = movementStore();
    const { userMode } = avatarStore();
    const { websocket, setWebsocket, setReceivedSocketData } = socketStore();
    const [isConnected, setIsConnected] = useState(false);
    const [newDataToSubmit, setNewDataToSubmit] = useState(false);

    if (!websocket) {
        const socket = new WebSocket(url);
        setWebsocket(socket)
    }

    const submitPositions = useCallback(() => {
        const data: UserDataPacket = {
            type: PositionsType.USERS,
            uid: cognito.username,
            data: { ...positions, movement, userMode },
        };

        try {
            websocket.send(
                JSON.stringify({
                    event: 'positions',
                    data,
                })
            );
        } catch (e) {
            console.warn(e)
        }

        setNewDataToSubmit(false);
    }, [cognito.username, movement, positions, websocket, userMode])

    const onConnect = useCallback(() => {
        setIsConnected(true)
    }, [setIsConnected])
    const onDisconnect = useCallback(() => setIsConnected(false), [setIsConnected])
    const onPositions = useCallback((event: MessageEvent) => {
        const packet: DataPacket = JSON.parse(event.data)
        if (packet.uid === cognito.username) return
        setReceivedSocketData(packet)
    }, [cognito.username, setReceivedSocketData])

    useFrame(() => {
        setFrames(frames + 1);
        if (frames % 15 === 0 && isConnected) setTrigger(true);
    });

    useEffect(() => {
        const shouldSendData = trigger && isConnected && newDataToSubmit;
        if (shouldSendData) submitPositions()
        if (trigger) setTrigger(false);
    }, [isConnected, newDataToSubmit, submitPositions, trigger]);

    useEffect(() => {
        if (!websocket) return;
        websocket.addEventListener('connect', onConnect);
        websocket.addEventListener('disconnect', onDisconnect);
        websocket.addEventListener('message', onPositions);

        if (websocket.OPEN) onConnect();
        else if (websocket.CLOSED) onDisconnect();

        return () => {
            websocket.removeEventListener('connect', onConnect);
            websocket.removeEventListener('disconnect', onDisconnect);
            websocket.removeEventListener('message', onPositions);
        };
    }, [onConnect, onDisconnect, onPositions, websocket]);


    useEffect(() => {
        if (isConnected) setNewDataToSubmit(true);
    }, [isConnected, movement, positions, setNewDataToSubmit]);

    return <>{children}</>;
}