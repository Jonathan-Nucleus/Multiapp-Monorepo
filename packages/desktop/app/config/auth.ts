/**
 * Next-Auth configurations.
 *
 */
import { NextAuthOptions } from "next-auth";

import { gql } from "@apollo/client";
import { createApolloClient } from "desktop/app/lib/apolloClient";

import providers from "./auth-providers";

export interface Session {
  name: string;
  email: string;
  access_token: string;
}

const AppAuthOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Extract access token from credentialed user object and persist it to
      // the jwt
      if (account && account.provider === "credentials") {
        token.access_token = user?.access_token;
      }

      // Fetch and persist Prometheus API access token on signin. Account
      // variable is only defined during sign in.
      else if (account && user && account.provider) {
        const { firstName, lastName, email } = user;
        const tokenId =
          account.provider === "google"
            ? account.id_token
            : account.access_token;

        // Request an access token from the Prometheus API based on the
        // OAuth token. The loginOAuth mutation also automatically creates a
        // new user record if this user is logging into Prometheus for the
        // first time. The access token requested here should be used to
        // authenticate any requests to secured API endpoints.
        const result = await createApolloClient().mutate({
          mutation: gql`
            mutation LoginOAuth($user: OAuthUserInput!) {
              loginOAuth(user: $user)
            }
          `,
          variables: {
            user: {
              email: email as string,
              firstName: firstName as string,
              lastName: lastName as string,
              tokenId: tokenId as string,
              provider: account.provider as string,
            },
          },
        });

        if (result.data && result.data.loginOAuth) {
          token.access_token = result.data.loginOAuth;
        }
      }

      return token;
    },
    session({ session, token }) {
      // Propagate Prometheus API access token from the JWT to the user
      // session
      session.access_token = token.access_token;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
    signOut: "/logout",
    error: "/error",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    inviteCode: "/invite-code",
    preferences: "/preferences",
  },
};

export default AppAuthOptions;
