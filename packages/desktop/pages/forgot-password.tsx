import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import ForgotPasswordPage from "../app/components/templates/ForgotPasswordPage";

const ForgotPassword: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ForgotPasswordPage />
    </div>
  );
};

ForgotPassword.layout = "onboarding";
ForgotPassword.middleware = "guest";

export default ForgotPassword;
