import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import InviteCodePage from "../app/components/templates/InviteCodePage";

const InviteCode: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Invite Code</title>
        <meta name="description" content="" />
      </Head>
      <InviteCodePage />
    </div>
  );
};

InviteCode.layout = "onboarding";
InviteCode.middleware = "guest";

export default InviteCode;
