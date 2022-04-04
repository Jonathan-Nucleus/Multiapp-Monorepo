import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import AuthLayout from "../app/components/layouts/auth";
import { ReactElement } from "react";
import MainLayout from "../app/components/layouts/main";
import ResetPasswordPage from "../app/components/templates/ResetPasswordPage";

const ResetPassword: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ResetPasswordPage />
    </div>
  );
};

ResetPassword.getLayout = (page: ReactElement) => {
  return (
    <MainLayout>
      <AuthLayout>{page}</AuthLayout>
    </MainLayout>
  );
};

export default ResetPassword
