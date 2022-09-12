import { FC, PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import {
  createApolloClient,
  ApolloPageProps,
} from "desktop/app/lib/apolloClient";

interface SecureApolloProviderProps extends PropsWithChildren<unknown> {
  apolloProps?: ApolloPageProps;
}

const SecureApolloProvider: FC<SecureApolloProviderProps> = ({
  children,
  apolloProps,
}) => {
  const { data: session } = useSession();
  const { graphqlUri, graphqlToken, initialApolloState } = apolloProps ?? {};
  const apolloClient = createApolloClient(
    graphqlToken ?? (session?.access_token as string),
    initialApolloState,
    graphqlUri
  );

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default SecureApolloProvider;
