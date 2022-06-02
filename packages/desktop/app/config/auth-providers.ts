import getConfig from "next/config";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

import jwt, { JwtPayload } from "jsonwebtoken";
import { gql } from "@apollo/client";
import { createApolloClient } from "desktop/app/lib/apolloClient";

const { publicRuntimeConfig = {} } = getConfig();
const { NEXT_PUBLIC_GRAPHQL_URI } = publicRuntimeConfig;

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
      const result = await createApolloClient(
        undefined,
        undefined,
        NEXT_PUBLIC_GRAPHQL_URI
      ).mutate({
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
        return { access_token: token };
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
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name, // Normalize prop name to firstName
          lastName: profile.family_name, // Normalize prop name to lastName
          email: profile.email,
          image: profile.picture,
        };
      },
    })
  );
}

if (process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET) {
  providers.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
      async profile(profile, tokens) {
        const emailResponse = await fetch(
          "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))",
          { headers: { Authorization: `Bearer ${tokens.access_token}` } }
        );
        const emailData = await emailResponse.json();
        return {
          id: profile.id,
          name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          firstName: profile.localizedFirstName, // Normalize prop name to firstName
          lastName: profile.localizedLastName, // Normalize prop name to lastName
          email: emailData?.elements?.[0]?.["handle~"]?.emailAddress,
          image:
            profile.profilePicture?.["displayImage~"]?.elements?.[0]
              ?.identifiers?.[0]?.identifier,
        };
      },
    })
  );
}

export default providers;
