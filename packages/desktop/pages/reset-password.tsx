import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
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

ResetPassword.layout = "auth";
ResetPassword.middleware = "guest";

export default ResetPassword;
