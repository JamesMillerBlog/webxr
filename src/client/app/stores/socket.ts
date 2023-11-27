import { create } from "zustand";
import { DataPacket } from "@shared/types";

export interface SocketState {
  websocket: null | WebSocket;
  receivedSocketData: null | DataPacket;
  setWebsocket: (prop: WebSocket) => void;
  setReceivedSocketData: (prop: DataPacket) => void;
}

export const socketStore = create<SocketState>((set) => ({
  websocket: null,
  receivedSocketData: null,
  setWebsocket: (prop) =>
    set(() => ({
      websocket: prop,
    })),
  setReceivedSocketData: (prop) =>
    set(() => ({
      receivedSocketData: prop,
    })),
}));
