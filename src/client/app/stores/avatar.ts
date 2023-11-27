import { UserDataPacket, UserMode } from "@shared/types";
import { create } from "zustand";

export interface AvatarState {
  userMode: UserMode | undefined;
  avatar: string | undefined;
  showIFrame: boolean;
  otherUserAvatars: UserDataPacket[];
  setUserMode: (prop: UserMode) => void;
  setAvatar: (prop: string) => void;
  setShowIFrame: (prop: boolean) => void;
  setOtherUserAvatars: (prop: UserDataPacket[]) => void;
}

export const avatarStore = create<AvatarState>((set) => ({
  userMode: undefined,
  avatar: undefined,
  showIFrame: false,
  otherUserAvatars: [],
  setShowIFrame: (prop: boolean) =>
    set(() => ({
      showIFrame: prop,
    })),
  setAvatar: (prop: string) =>
    set(() => ({
      avatar: prop,
    })),
  setUserMode: (prop: UserMode) =>
    set(() => ({
      userMode: prop,
    })),
  setOtherUserAvatars: (prop: UserDataPacket[]) =>
    set(() => ({
      otherUserAvatars: prop,
    })),
}));
