"use client"
import "./globals.css";
import "@aws-amplify/ui-react/styles.css";
import React, { ReactNode } from "react";
import { SignInProvider } from "./providers/SignIn";
import { Authenticator } from "@aws-amplify/ui-react";
import { Sockets } from "./providers/Sockets";
import ChimeProvider from "./providers/Chime";

export const App = (props: { children: ReactNode; }) => {
    const { children } = props;
    return (
        <Authenticator.Provider>
            <SignInProvider>
                <Sockets>
                    <ChimeProvider>
                        {children}
                    </ChimeProvider>
                </Sockets>
            </SignInProvider>
        </Authenticator.Provider>
    );
};