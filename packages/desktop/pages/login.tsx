import Head from "next/head";
import LoginPage from "../app/components/templates/LoginPage";
import { NextPageWithLayout } from "../app/types/next-page";
import AuthLayout from "../app/components/layouts/auth";
import { ReactElement } from "react";
import MainLayout from "../app/components/layouts/main";

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

Login.getLayout = (page: ReactElement) => {
  return (
    <MainLayout>
      <AuthLayout>{page}</AuthLayout>
    </MainLayout>
  );
};

export default Login;
