import NextAuth from "next-auth";
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
    }
}

export const authOptions: any = {
    // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET as string,
    providers: [
        GithubProvider({
            clientId: process.env.GIT_CLIENT_ID!,
            clientSecret: process.env.GIT_SECRET_KEY!,
            authorization: {
                params: {
                    scope: "read:user repo",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }: { user: AuthUser; account: Account }) {
            if (account?.provider === "github") {
                try {
                    const userData = {
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    };

                    try {
                        console.log("User data", userData);
                        const res = await axiosInstance.post(
                            "auth/signup",
                            userData
                        );

                        const data = res.data.data;
                        console.log("Data", data);
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
        async jwt({ token, account }: { token: any; account: Account }) {
            // Persist the OAuth access token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
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
            return session;
        },
    },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
