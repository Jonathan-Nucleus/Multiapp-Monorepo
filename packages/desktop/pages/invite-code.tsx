import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import AuthLayout from "../app/components/layouts/auth";
import { ReactElement } from "react";
import MainLayout from "../app/components/layouts/main";
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

InviteCode.getLayout = (page: ReactElement) => {
  return (
    <MainLayout>
      <AuthLayout>{page}</AuthLayout>
    </MainLayout>
  );
};

export default InviteCode
