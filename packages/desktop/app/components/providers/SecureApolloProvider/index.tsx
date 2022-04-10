import { FC } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import {
  createApolloClient,
  ApolloPageProps,
} from "desktop/app/lib/apolloClient";

interface SecureApolloProviderProps {
  apolloProps?: ApolloPageProps;
}

const SecureApolloProvider: FC<SecureApolloProviderProps> = ({
  children,
  apolloProps,
}) => {
  const { data: session } = useSession();
  const { graphqlToken, initialApolloState } = apolloProps ?? {};
  const apolloClient = createApolloClient(
    graphqlToken ?? (session?.access_token as string),
    initialApolloState
  );

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default SecureApolloProvider;
