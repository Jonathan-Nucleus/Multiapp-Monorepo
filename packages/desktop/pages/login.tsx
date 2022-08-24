import Head from "next/head";
import { GetServerSideProps } from "next";
import LoginPage from "../app/components/templates/LoginPage";
import { NextPageWithLayout } from "../app/types/next-page";
import { getProviders } from "next-auth/react";

export interface LoginProps {
  providers: UnwrapPromise<ReturnType<typeof getProviders>>;
}

const Login: NextPageWithLayout<LoginProps> = ({}) => {
  // Disabled until a strategy for handling bots has been identified (06/29/2022)
  // const ssoProviders = Object.keys(providers).filter(
  //   (provider) => provider == "google"
  // );
  return (
    <div>
      <Head>
        <title>Prometheus Login</title>
        <meta name="description" content="" />
      </Head>
      <LoginPage ssoProviders={[]} />
    </div>
  );
};

Login.layout = "onboarding";
Login.middleware = "guest";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      providers: await getProviders(),
    },
  };
};

export default Login;
