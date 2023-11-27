import { User } from "@shared/types";
import { create } from "zustand";

export interface UserState {
  user: User;
  setUser: (prop: User) => void;
}

export const userStore = create<UserState>((set) => ({
  user: {
    avatar: undefined,
    image: undefined,
    role: undefined,
    uid: undefined,
    userMode: undefined,
  },
  setUser: (prop) =>
    set(() => ({
      user: prop,
    })),
}));
