/**
 * Next-Auth configurations.
 *
 */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

import jwt, { JwtPayload } from "jsonwebtoken";
import { gql } from "@apollo/client";
import { getApolloClient } from "desktop/app/lib/apolloClient";

const providers: Provider[] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials) return null;
      const { email, password } = credentials;
      const result = await getApolloClient().mutate({
        mutation: gql`
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }
        `,
        variables: { email, password },
      });

      const { data } = result;
      if (data && data.login) {
        const token = data.login;
        const user = jwt.decode(token);

        if (user) {
          const { _id, role, acc } = user as JwtPayload;
          return { _id, role, acc };
        }
      }

      return null;
    },
  }),
];

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  );
}

if (process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET) {
  providers.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
    })
  );
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
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },

    session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },

    async signIn({ profile, account }) {
      let { email } = profile;
      if (account.provider === "linkedin") {
        // Fetch primary email address for authenticated linkedin user
        const emailResponse = await fetch(
          "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))",
          { headers: { Authorization: `Bearer ${account.access_token}` } }
        );
        const emailData = await emailResponse.json();
        email = emailData?.elements?.[0]?.["handle~"]?.emailAddress;
      }

      const profileDetails =
        account.provider === "google"
          ? {
              firstName: profile.given_name as string,
              lastName: profile.family_name as string,
              tokenId: account.id_token as string,
            }
          : account.provider === "linkedin"
          ? {
              firstName: profile.localizedFirstName as string,
              lastName: profile.localizedLastName as string,
              tokenId: account.access_token as string,
            }
          : null;

      if (email && profileDetails) {
        const result = await getApolloClient().mutate({
          mutation: gql`
            mutation LoginOAuth($user: OAuthUserInput!) {
              loginOAuth(user: $user)
            }
          `,
          variables: {
            user: {
              email,
              provider: account.provider as string,
              ...profileDetails,
            },
          },
        });
      }

      return true;
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
