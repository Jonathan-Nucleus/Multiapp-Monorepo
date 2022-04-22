import Head from "next/head";
import { GetServerSideProps } from "next";
import { NextPageWithLayout } from "../../app/types/next-page";
import SignupPage from "../../app/components/templates/SignupPage";

import { getServerSession } from "next-auth";
import { getVerifyInvite } from "desktop/app/queries/authentication.graphql";

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

Signup.layout = "auth";
Signup.middleware = "guest";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { code } = ctx.params as Record<string, string>;
  const { data } = await getVerifyInvite(code);

  if (!data || !data.verifyInvite) {
    return {
      redirect: { destination: "/invite-code", permanent: false },
    };
  }

  return {
    props: {},
  };
};

export default Signup;
