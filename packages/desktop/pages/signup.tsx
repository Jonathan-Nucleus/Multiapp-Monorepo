import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import AuthLayout from "../app/components/layouts/auth";
import { ReactElement } from "react";
import SignupPage from "../app/components/templates/SignupPage";

const Signup: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Signup - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignupPage />
    </div>
  );
};

Signup.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;
Signup.middleware = "guest";

export default Signup;
