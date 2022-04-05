import "../app/styles/app.scss";
import type { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";
import { useApollo } from "desktop/app/lib/apolloClient";

import MainLayout from "../app/components/layouts/main";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { NextPageWithLayout } from "../app/types/next-page";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const apolloClient = useApollo(pageProps);

  if (!apolloClient) {
    return <></>;
  }

  const getLayout =
    Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider>
        <ThemeProvider>{getLayout(<Component {...pageProps} />)}</ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default MyApp;
