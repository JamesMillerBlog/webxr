import { create } from "zustand";

export interface Cognito {
  username: string | undefined;
  jwt: string | undefined;
}

export enum SignIn {
  SIGNED_OUT,
  SIGNED_IN,
  SIGN_OUT,
}

export interface CognitoState {
  cognito: Cognito;
  setCognito: (prop: Cognito) => void;
  signInState: SignIn;
  setSignInState: (prop: SignIn) => void;
}

export const cognitoStore = create<CognitoState>((set) => ({
  cognito: {
    username: undefined,
    jwt: undefined,
  },
  setCognito: (prop) =>
    set(() => ({
      cognito: prop,
    })),
  signInState: SignIn.SIGNED_OUT,
  setSignInState: (prop) =>
    set(() => ({
      signInState: prop,
    })),
}));
