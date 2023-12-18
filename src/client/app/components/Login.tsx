"use client"

import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import styled from "styled-components";
import "@aws-amplify/ui-react/styles.css";

export default function Login() {
    return (
        <AmplifyWrapper>
            <Authenticator
                hideSignUp
            ></Authenticator>
        </AmplifyWrapper>
    );
}
const AmplifyWrapper = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;