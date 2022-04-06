import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
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

InviteCode.layout = "auth";
InviteCode.middleware = "guest";

export default InviteCode;
