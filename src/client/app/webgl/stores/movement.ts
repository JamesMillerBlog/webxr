import { Movement } from "@shared/types";
import { create } from "zustand";

export interface MovementState {
  movement: Movement;
  setMovement: (direction: string, state: boolean) => void;
}

export const movementStore = create<MovementState>((set) => ({
  movement: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  },
  setMovement: (direction: string, state: boolean) =>
    set((m) => ({
      movement: { ...m.movement, [direction]: state },
    })),
}));
