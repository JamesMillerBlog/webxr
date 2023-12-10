import { Ref } from "react";
import { Group } from "three";
import { create } from "zustand";

export interface Selected {
  objectname: string | undefined;
  position: {
    x: number;
    y: number;
    z: number;
  };
  group: Ref<Group> | undefined;
}

export interface SelectedObjectState {
  selectedObject: Selected;
  setSelectedObject: (prop: Selected) => void;
}

export const selectedObjectStore = create<SelectedObjectState>((set) => ({
  selectedObject: {
    objectname: undefined,
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    group: undefined,
  },
  setSelectedObject: (prop) =>
    set(() => ({
      selectedObject: prop,
    })),
}));
