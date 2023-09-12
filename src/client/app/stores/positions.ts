import { Objects } from "@shared/types";
import { create } from "zustand";

export interface PositionState {
  positions: Objects;
  setPositions: (positions: Objects) => void;
}

const coordinates = {
  x: 0,
  y: 0,
  z: 0,
};

const positions = {
  position: coordinates,
  rotation: coordinates,
};

export const positionsStore = create<PositionState>((set) => ({
  positions: {
    body: positions,
    leftHand: positions,
    rightHand: positions,
  },
  setPositions: (prop) =>
    set(() => ({
      positions: prop,
    })),
}));
