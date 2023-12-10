import { create } from "zustand";

export enum Device {
  WEB = "web",
  WEB_AR = "webAR",
  WEB_VR = "webVR",
}

export interface DeviceState {
  device: Device | undefined;
  setDevice: (prop: Device) => void;
}

export const deviceStore = create<DeviceState>((set) => ({
  device: undefined,
  setDevice: (prop: Device) =>
    set(() => ({
      device: prop,
    })),
}));
