import "../app/styles/app.scss";
import getConfig from "next/config";
import App, { AppProps, AppInitialProps, AppContext } from "next/app";

import RootLayout from "../app/components/layouts/index";
import SecureApolloProvider from "../app/components/providers/SecureApolloProvider";
import { ThemeProvider } from "next-themes";
import { getSession, SessionProvider } from "next-auth/react";
import { NextPageWithLayout } from "../app/types/next-page";
import { initializeDatadogRum } from "../app/lib/datadog";
import AppAuthOptions from "../app/config/auth";
import Head from "next/head";

initializeDatadogRum();

type MyAppProps = {
  runtimeVars: {
    NEXT_PUBLIC_GRAPHQL_URI: string;
    NEXT_PUBLIC_GETSTREAM_ACCESS_KEY: string;
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
    <>
      <Head>
        <title>Prometheus</title>
      </Head>
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
              getstreamKey={runtimeVars.NEXT_PUBLIC_GETSTREAM_ACCESS_KEY}
            >
              <Component {...pageProps} />
            </RootLayout>
          </ThemeProvider>
        </SecureApolloProvider>
      </SessionProvider>
    </>
  );
}

type MyAppContext = AppContext & {
  Component: NextPageWithLayout;
};

MyApp.getInitialProps = async (
  context: MyAppContext
): Promise<AppInitialProps & MyAppProps> => {
  const appProps = await App.getInitialProps(context);
  const { publicRuntimeConfig } = getConfig();
  const { NEXT_PUBLIC_GRAPHQL_URI, NEXT_PUBLIC_GETSTREAM_ACCESS_KEY } =
    publicRuntimeConfig;

  // Determine redirect if needed.
  const session = await getSession(context.ctx);
  const middleware = context.Component.middleware;
  let redirect;
  if (middleware == "auth" && !session?.access_token) {
    redirect = `${AppAuthOptions.pages?.signIn}?redirect=${context.router.asPath}`;
  } else if (middleware == "guest" && session?.access_token) {
    redirect = "/";
  }
  if (redirect) {
    if (context.ctx.res) {
      context.ctx.res.writeHead(307, {
        Location: redirect,
      });
      context.ctx.res.end();
    } else {
      await context.router.replace(redirect);
    }
  }

  return {
    ...appProps,
    pageProps: {
      ...(appProps.pageProps || {}),
      session,
    },
    runtimeVars: {
      NEXT_PUBLIC_GRAPHQL_URI,
      NEXT_PUBLIC_GETSTREAM_ACCESS_KEY,
    },
  };
};

export default MyApp;
