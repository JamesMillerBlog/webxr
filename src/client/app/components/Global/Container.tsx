"use client"
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import React, { ReactNode } from "react";
import { GlobalStyle } from "./style";
import { Cognito } from "../Cognito";

export const Container = (props: { children: ReactNode; }) => {
    const { children } = props;
    return (
        <Authenticator.Provider>
            <GlobalStyle />
            <Cognito>
                <> {children} </>
            </Cognito>
        </Authenticator.Provider>
    );
};