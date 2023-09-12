import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import React, { ReactNode, useCallback, useEffect } from "react";
import { cognitoStore, avatarStore, userStore, SignIn } from "../../stores";
import styled from "styled-components";
import { setupAmplify, configureUserData, UserCredentials, setupUser } from ".";
import { Auth } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { updateUserData } from "../../common";

export const Cognito = (props: { children: ReactNode; }) => {
  const { children } = props;
  const { cognito, signInState, setCognito, setSignInState } = cognitoStore();
  const { user } = useAuthenticator((context) => [context.user]);
  const { avatar, userMode, setUserMode, setAvatar } = avatarStore();
  const { setUser } = userStore();

  useEffect(() => {
    setupAmplify();
  }, [])

  const signOut = useCallback(async () => {
    setSignInState(SignIn.SIGNED_OUT);
    await Auth.signOut();
  }, [setSignInState])

  const signIn = useCallback(() => {
    const userCredentials: UserCredentials | undefined = (user)
      ? user.getSignInUserSession() as unknown as UserCredentials
      : undefined;

    if (cognito.jwt === undefined && userCredentials) {
      const token = configureUserData(userCredentials);
      setSignInState(SignIn.SIGNED_IN)
      setCognito(token);
    }
  }, [cognito, user, setSignInState, setCognito]);

  const postLoginSetup = useCallback(async () => {
    if (!cognito.jwt) setSignInState(SignIn.SIGN_OUT)
    try {
      const { selectedAvatar, selectedUserMode, user } = await setupUser(cognito, userMode, avatar)
      if (selectedAvatar) setAvatar(selectedAvatar);
      setUserMode(selectedUserMode);
      setUser(user);
      await updateUserData(cognito, selectedUserMode, selectedAvatar);
    } catch (e) {
      console.error(e);
    }
  }, [cognito, setAvatar, setUserMode, userMode, setUser, avatar, setSignInState]);

  useEffect(() => {
    switch (signInState) {
      case SignIn.SIGN_OUT:
        signOut();
        break;
      case SignIn.SIGNED_OUT:
        signIn();
        break;
      case SignIn.SIGNED_IN:
        postLoginSetup();
        break;
    }
  }, [signInState, signOut, signIn, postLoginSetup]);

  switch (signInState) {
    case SignIn.SIGNED_IN:
      return (
        <ContentWrapper>{children}</ContentWrapper>
      );
    default:
      return (
        <AmplifyWrapper>
          <Authenticator
            hideSignUp
          ></Authenticator>
        </AmplifyWrapper>
      );
  }
};

const AmplifyWrapper = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;
const ContentWrapper = styled("div")`
  position: relative;
  z-index: 1;
  width: 100vw;
  height: 100vh;
`;