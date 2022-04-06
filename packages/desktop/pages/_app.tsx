import "../app/styles/app.scss";
import type { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { useApollo } from "desktop/app/lib/apolloClient";

import RootLayout from "../app/components/layouts/root";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { NextPageWithLayout } from "../app/types/next-page";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const apolloClient = useApollo({
    ...pageProps,
    graphqlToken: session?.access_token,
  });
  const getLayout = Component.getLayout ?? ((page) => page);
  const page = (
    <SessionProvider session={session}>
      <ThemeProvider>
        <RootLayout middleware={Component.middleware}>
          {getLayout(<Component {...pageProps} />)}
        </RootLayout>
      </ThemeProvider>
    </SessionProvider>
  );
  return !apolloClient ? (
    page
  ) : (
    <ApolloProvider client={apolloClient}>{page}</ApolloProvider>
  );
}

export default MyApp;
