import { AuthOptions, NextAuthOptions } from "next-auth";
import {
    Account,
    User as AuthUser,
    Session as NextAuthSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import axiosInstance from "@/config/axiosInstance";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        serverToken?: string;
    }

    interface JWT {
        accessToken?: string;
        serverToken?: string;
    }
}

export const authOptions: any = {
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        GithubProvider({
            clientId: process.env.GIT_CLIENT_ID!,
            clientSecret: process.env.GIT_SECRET_KEY!,
            authorization: {
                params: {
                    scope: "read:user repo user:email",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({
            user,
            account,
            profile,
        }: {
            user: AuthUser;
            account: Account;
            profile: any;
        }) {
            if (account?.provider === "github") {
                try {
                    const email = profile.email || user.email;
                    const userData = {
                        email: email,
                        name: user.name,
                        image: user.image,
                    };

                    if (!email) {
                        throw new Error("Email is undefined");
                    }

                    try {
                        const res = await axiosInstance.post(
                            "auth/signup",
                            userData
                        );
                        const data = res.data.data;
                        account.serverToken = data?.token;
                    } catch (error) {
                        console.log(error);
                    }

                    return true;
                } catch (err) {
                    console.log("Error saving user", err);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, account }: { token: any; account?: Account }) {
            // Persist the OAuth access token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
                if (account.serverToken) {
                    token.serverToken = account.serverToken; // Store serverToken in JWT token
                }
            }
            return token;
        },
        async session({
            session,
            token,
        }: {
            session: NextAuthSession;
            token: any;
        }) {
            // Send properties to the client, like an access token from a provider.
            session.accessToken = token.accessToken;
            session.serverToken = token.serverToken;
            return session;
        },
    },
};
