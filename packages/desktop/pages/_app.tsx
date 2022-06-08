import "../app/styles/app.scss";
import getConfig from "next/config";
import { getSession } from "next-auth/react";
import App, { AppProps, AppInitialProps, AppContext } from "next/app";

import RootLayout from "../app/components/layouts/index";
import SecureApolloProvider from "../app/components/providers/SecureApolloProvider";
import type { ApolloPageProps } from "desktop/app/lib/apolloClient";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { NextPageWithLayout } from "../app/types/next-page";
import { initializeDatadogRum } from "../app/lib/datadog";

initializeDatadogRum();

type MyAppProps = {
  runtimeVars: {
    NEXT_PUBLIC_GRAPHQL_URI: string;
  };
};

type AppPropsWithLayout = AppProps &
  MyAppProps & {
    Component: NextPageWithLayout;
  };

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  runtimeVars,
}: AppPropsWithLayout) {
  return (
    <SessionProvider session={session}>
      <SecureApolloProvider
        apolloProps={{
          ...pageProps,
          graphqlUri: runtimeVars.NEXT_PUBLIC_GRAPHQL_URI,
        }}
      >
        <ThemeProvider>
          <RootLayout
            middleware={Component.middleware}
            layout={Component.layout}
            background={Component.background}
          >
            <Component {...pageProps} />
          </RootLayout>
        </ThemeProvider>
      </SecureApolloProvider>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async (
  ctx: AppContext
): Promise<AppInitialProps & MyAppProps> => {
  const appProps = await App.getInitialProps(ctx);
  const { publicRuntimeConfig } = getConfig();
  const { NEXT_PUBLIC_GRAPHQL_URI } = publicRuntimeConfig;
  const session = await getSession({ req: ctx.ctx.req });

  return {
    ...appProps,
    pageProps: {
      ...(appProps.pageProps || {}),
      session,
    },
    runtimeVars: {
      NEXT_PUBLIC_GRAPHQL_URI,
    },
  };
};

export default MyApp;
