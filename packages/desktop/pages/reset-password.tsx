import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import AuthLayout from "../app/components/layouts/auth";
import { ReactElement } from "react";
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

ResetPassword.getLayout = (page: ReactElement) => (
  <AuthLayout>{page}</AuthLayout>
);
ResetPassword.middleware = "guest";

export default ResetPassword;
