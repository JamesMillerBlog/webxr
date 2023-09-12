import { JsonValue, SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { Socket } from "socket.io-client";
import { create } from "zustand";
import { DataPacket } from "@shared/types";

export interface SocketState {
  socketIO: null | Socket;
  receivedSocketData: null | DataPacket;
  socketUpdate: boolean;
  sendJson: null | SendJsonMessage;
  lastJsonMessage: JsonValue;
  setSocketUpdate: (prop: boolean) => void;
  setSendJson: (prop: SendJsonMessage) => void;
  setLastJsonMessage: (prop: JsonValue) => void;
  setSocketIO: (prop: Socket) => void;
  setReceivedSocketData: (prop: DataPacket) => void;
}

export const socketStore = create<SocketState>((set) => ({
  socketIO: null,
  receivedSocketData: null,
  socketUpdate: false,
  sendJson: null,
  lastJsonMessage: null,
  setSocketUpdate: (prop) =>
    set(() => ({
      socketUpdate: prop,
    })),
  setSendJson: (prop) =>
    set(() => ({
      sendJson: prop,
    })),
  setLastJsonMessage: (prop) =>
    set(() => ({
      lastJsonMessage: prop,
    })),
  setSocketIO: (prop) =>
    set(() => ({
      socketIO: prop,
    })),
  setReceivedSocketData: (prop) =>
    set(() => ({
      receivedSocketData: prop,
    })),
}));
