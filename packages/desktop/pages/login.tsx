import Head from "next/head";
import { GetServerSideProps } from "next";
import LoginPage from "../app/components/templates/LoginPage";
import { NextPageWithLayout } from "../app/types/next-page";
import AuthLayout from "../app/components/layouts/auth";
import { ReactElement } from "react";
import MainLayout from "../app/components/layouts/main";

import { getSession, getProviders } from "next-auth/react";

interface LoginProps {
  providers: ReturnType<typeof getProviders>;
}

const Login: NextPageWithLayout<LoginProps> = ({ providers }) => {
  return (
    <div>
      <Head>
        <title>Prometheus Login</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginPage providers={providers} />
    </div>
  );
};

Login.getLayout = (page: ReactElement) => {
  return (
    <MainLayout>
      <AuthLayout>{page}</AuthLayout>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  return {
    props: {
      session: await getSession({ req }),
      providers: await getProviders(),
    },
  };
};

export default Login;
