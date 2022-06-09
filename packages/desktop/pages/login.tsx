import Head from "next/head";
import { GetServerSideProps } from "next";
import LoginPage from "../app/components/templates/LoginPage";
import { NextPageWithLayout } from "../app/types/next-page";
import { getProviders } from "next-auth/react";

export interface LoginProps {
  providers: UnwrapPromise<ReturnType<typeof getProviders>>;
}

const Login: NextPageWithLayout<LoginProps> = ({ providers }) => {
  const ssoProviders = Object.keys(providers).filter(
    (provider) => provider == "google"
  );
  return (
    <div>
      <Head>
        <title>Prometheus Login</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginPage ssoProviders={ssoProviders} />
    </div>
  );
};

Login.layout = "auth";
Login.middleware = "guest";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      providers: await getProviders(),
    },
  };
};

export default Login;
