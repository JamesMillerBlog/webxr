import { useCallback, useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import {
    COGNITO_IDENTITY_POOL_ID,
    COGNITO_USER_POOL_CLIENT_ID,
    COGNITO_USER_POOL_ID,
    REGION,
} from "../common";
import { Auth } from "aws-amplify";
import { SignInState, useAuthStore } from "../stores";

export interface UserCredentials {
    accessToken: {
        payload: {
            "cognito:groups": string;
            username: string;
        };
    };
    idToken: {
        jwtToken: string;
    };
}

export function setupAmplify() {
    Amplify.configure({
        Auth: {
            identityPoolId: COGNITO_IDENTITY_POOL_ID,
            region: REGION,
            userPoolId: COGNITO_USER_POOL_ID,
            userPoolWebClientId: COGNITO_USER_POOL_CLIENT_ID,
        },
    });
}

export const configureUserData = (user: UserCredentials) => {
    const { accessToken, idToken } = user;
    const role = accessToken.payload["cognito:groups"];
    const token = {
        jwt: idToken.jwtToken,
        role: role ? role[0] : "",
        username: accessToken.payload.username,
    };
    return token;
};

export const SignInProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const store = useAuthStore();
    const { auth, signInState, actions } = store;
    const { updateSignInStatus } = actions;
    const [signOutComplete, setSignOutComplete] = useState<boolean>(true)

    useEffect(() => {
        setupAmplify();
    }, [])

    const signOut = useCallback(async () => {
        setSignOutComplete(false)
        const auth = { jwt: undefined, username: undefined };
        const signInState = SignInState.READY_TO_SIGN_IN;
        updateSignInStatus({ auth, signInState })
        await Auth.signOut({ global: true });
        setTimeout(() => setSignOutComplete(true), 2000)
    }, [updateSignInStatus])

    const { user } = useAuthenticator((context) => [context.user]);

    const signIn = useCallback(() => {
        const userCredentials: UserCredentials | undefined = (user)
            ? user.getSignInUserSession() as unknown as UserCredentials
            : undefined;
        if (auth.jwt === undefined && userCredentials) {
            const auth = configureUserData(userCredentials);
            const signInState = SignInState.SIGNED_IN;

            updateSignInStatus({ auth, signInState })
        }
    }, [user, auth.jwt, updateSignInStatus]);

    useEffect(() => {
        switch (signInState) {
            case SignInState.SIGN_OUT:
                signOut();
                break;
            case SignInState.READY_TO_SIGN_IN:
                if (signOutComplete && !auth.jwt) signIn();
                break;
        }
    }, [auth.jwt, signInState, signIn, signOut, signOutComplete, user])

    return (
        <>
            {children}
        </>
    )
}
