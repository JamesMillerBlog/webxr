import { useState, useEffect, useCallback } from "react";
import { useAuthStore, useSocketStore } from "../stores";
import { movementStore, positionsStore, avatarStore } from "../webgl/stores";
import { WS_API_URL } from "../common";
import { UserDataPacket, PositionsType, DataPacket } from "@shared/types";

export const Sockets = (props) => {
    const { children } = props;
    const { auth } = useAuthStore();
    const url = `${WS_API_URL}?token=${auth.jwt}`

    const { positions } = positionsStore();
    const { movement } = movementStore();
    const { userMode } = avatarStore();
    const { websocket, shouldUpdateSockets, isConnected } = useSocketStore();
    const { handleReceivedMessage, setupWebsocket, connectToSocket, submitDataToWebSocket } = useSocketStore((state) => state.actions);

    const [loadSocket, setLoadSocket] = useState(false);
    const [newDataToSubmit, setNewDataToSubmit] = useState(false);

    useEffect(() => {
        if (auth.jwt) {
            setLoadSocket(true)
            if (!websocket) {
                const socket = new WebSocket(url);
                setupWebsocket(socket)
            }
        }
    }, [auth.jwt, setupWebsocket, url, websocket])

    const onConnect = useCallback(() => {
        if (websocket.OPEN && !websocket.CONNECTING) {
            connectToSocket(true)
        }
    }, [connectToSocket, websocket])

    const onDisconnect = useCallback(() => {
        connectToSocket(false)
    }, [connectToSocket])


    const submitPositions = useCallback(() => {
        const data: UserDataPacket = {
            type: PositionsType.USERS,
            uid: auth.username,
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
    }, [auth.username, websocket, positions, movement, userMode])

    const onMessage = useCallback((event: MessageEvent) => {
        const packet: DataPacket = JSON.parse(event.data)
        if (packet.uid === auth.username) return
        handleReceivedMessage(packet)
    }, [auth.username, handleReceivedMessage])

    useEffect(() => {
        const shouldSendData = shouldUpdateSockets && isConnected && newDataToSubmit && loadSocket;
        if (shouldSendData) submitPositions()
        if (shouldUpdateSockets) submitDataToWebSocket(false);
    }, [isConnected, newDataToSubmit, submitPositions, shouldUpdateSockets, submitDataToWebSocket, loadSocket]);

    useEffect(() => {
        if (!websocket || !loadSocket) return;
        websocket.addEventListener('connect', onConnect);
        websocket.addEventListener('disconnect', onDisconnect);
        websocket.addEventListener('message', onMessage);

        if (websocket.OPEN) onConnect();
        else if (websocket.CLOSED) onDisconnect();

        return () => {
            websocket.removeEventListener('connect', onConnect);
            websocket.removeEventListener('disconnect', onDisconnect);
            websocket.removeEventListener('message', onMessage);
        };
    }, [loadSocket, onConnect, onDisconnect, onMessage, websocket]);


    useEffect(() => {
        if (isConnected) setNewDataToSubmit(true);
    }, [isConnected, movement, positions, setNewDataToSubmit]);

    return (
        <>
            {children}
        </>
    )
}