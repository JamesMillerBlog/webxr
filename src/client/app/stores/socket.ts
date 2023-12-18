import { create } from "zustand";
import { DataPacket } from "@shared/types";

export interface SocketStore {
  websocket: null | WebSocket;
  receivedSocketData: null | DataPacket;
  shouldUpdateSockets: boolean;
  isConnected: boolean;

  actions: {
    setupWebsocket: (prop: WebSocket) => void;
    handleReceivedMessage: (prop: DataPacket) => void;
    submitDataToWebSocket: (prop: boolean) => void;
    connectToSocket: (prop: boolean) => void;
  };
}

export const useSocketStore = create<SocketStore>((set) => ({
  websocket: null,
  receivedSocketData: null,
  shouldUpdateSockets: false,
  isConnected: false,

  actions: {
    setupWebsocket: (websocket) => set(() => ({ websocket })),
    handleReceivedMessage: (receivedSocketData) =>
      set(() => ({ receivedSocketData })),
    submitDataToWebSocket: (shouldUpdateSockets: boolean) =>
      set({ shouldUpdateSockets }),
    connectToSocket: (isConnected: boolean) => set({ isConnected }),
  },
}));
