import React from "react";
import styled from "styled-components";
import { avatarStore } from "../webgl/stores";
import { SignInState, useAuthStore } from "../stores";
import { UserMode } from "@shared/types";

export default function Header() {
  const { updateSignInStatus } = useAuthStore().actions;
  const { showIFrame, setShowIFrame, setUserMode } = avatarStore();

  const signOut = () => {
    const auth = { jwt: undefined, username: undefined };
    const signInState = SignInState.SIGN_OUT;

    updateSignInStatus({ auth, signInState })
  }

  return (
    <Nav>
      <AvatarToggleBtn
        className="toggleButton"
        onClick={() => setShowIFrame(!showIFrame)}
        type="button"
      >
        {`${showIFrame ? "Close Configurator" : "Configure Avatar"}`}
      </AvatarToggleBtn>
      {showIFrame && (
        <SelectImageBtn
          onClick={() => {
            setUserMode(UserMode.IMAGE);
            setShowIFrame(false);
          }}
        >
          Select Image
        </SelectImageBtn>
      )}
      <SignoutBtn onClick={signOut}>
        Log out
      </SignoutBtn>
    </Nav>
  );
}

const Nav = styled.nav`
  display: block;
  height: 80px;
  width: 100vw;
  background-color: #102b4e;
  margin: 0;
  position: relative;
  top: 0px;
  padding-top: 0px;
  z-index: 1;
`;

const SignoutBtn = styled.button`
  font-size: 16px;
  text-decoration: none;
  &:hover {
    background: none;
  }
  cursor: pointer;
  color: white;
  background-color: grey;
  float: right;
`;

const AvatarToggleBtn = styled.button`
  font-size: 16px;
  text-decoration: none;
  &:hover {
    background: none;
  }
  cursor: pointer;
  color: white;
  background-color: grey;
  float: left;
`;

const SelectImageBtn = styled.button`
  font-size: 16px;
  text-decoration: none;
  &:hover {
    background: darkred;
  }
  cursor: pointer;
  color: white;
  background-color: red;
  float: left;
`;
