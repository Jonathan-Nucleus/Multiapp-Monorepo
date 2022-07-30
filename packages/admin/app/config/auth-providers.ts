import getConfig from "next/config";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers";

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
      const { data } = await createApolloClient(
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

      if (data?.login) {
        const token = data.login;
        return { access_token: token };
      }

      return null;
    },
  }),
];

export default providers;
