import Head from "next/head";
import { GetServerSideProps } from "next";
import LoginPage from "../app/components/templates/LoginPage";
import { NextPageWithLayout } from "../app/types/next-page";
import { getProviders } from "next-auth/react";

const Login: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Prometheus Login</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginPage />
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
