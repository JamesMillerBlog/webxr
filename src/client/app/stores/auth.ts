import { create } from "zustand";

export interface Cognito {
  username: string | undefined;
  jwt: string | undefined;
}

export enum SignInState {
  READY_TO_SIGN_IN,
  SIGNED_IN,
  SIGN_OUT,
}

export interface CognitoStore {
  auth: Cognito;
  signInState: SignInState;

  actions: {
    updateSignInStatus: (prop: AuthStatus) => void;
  };
}

export interface AuthStatus {
  auth: Cognito;
  signInState: SignInState;
}

const init = {
  username: undefined,
  jwt: undefined,
};

export const useAuthStore = create<CognitoStore>((set) => ({
  auth: init,
  signInState: SignInState.READY_TO_SIGN_IN,

  actions: {
    updateSignInStatus: ({ auth, signInState }) => set({ auth, signInState }),
  },
}));
