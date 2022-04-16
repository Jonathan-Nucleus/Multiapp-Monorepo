import Head from "next/head";
import { GetServerSideProps } from "next";
import LoginPage from "../app/components/templates/LoginPage";
import { NextPageWithLayout } from "../app/types/next-page";
import { getProviders } from "next-auth/react";

interface LoginProps {
  providers: ReturnType<typeof getProviders>;
}

const Login: NextPageWithLayout<LoginProps> = ({ providers }) => {
  return (
    <div>
      <Head>
        <title>Prometheus Login</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <LoginPage providers={providers} />
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
