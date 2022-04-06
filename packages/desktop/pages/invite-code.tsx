import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import AuthLayout from "../app/components/layouts/auth";
import { ReactElement } from "react";
import InviteCodePage from "../app/components/templates/InviteCodePage";

const InviteCode: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Invite Code</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InviteCodePage />
    </div>
  );
};

InviteCode.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;
InviteCode.middleware = "guest";

export default InviteCode;
