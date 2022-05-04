import "../app/styles/app.scss";
import type { GetServerSideProps } from "next";
import type { AppProps } from "next/app";

import RootLayout from "../app/components/layouts/index";
import SecureApolloProvider from "../app/components/providers/SecureApolloProvider";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { NextPageWithLayout } from "../app/types/next-page";

import { initializeDatadogRum } from "../app/lib/datadog";
initializeDatadogRum();

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  return (
    <SessionProvider session={session}>
      <SecureApolloProvider apolloProps={pageProps}>
        <ThemeProvider>
          <RootLayout
            middleware={Component.middleware}
            layout={Component.layout}
          >
            <Component {...pageProps} />
          </RootLayout>
        </ThemeProvider>
      </SecureApolloProvider>
    </SessionProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Prevent static page optimization to enable runtime use of Datadog
  // application key from local environment
  return {
    props: {},
  };
};

export default MyApp;
