import Head from "next/head";
import RequestCodePage from "../app/components/templates/RequestCodePage";
import { NextPageWithLayout } from "../app/types/next-page";

const RequestCode: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Get an Invite</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RequestCodePage />
    </div>
  );
};

RequestCode.layout = "onboarding";
RequestCode.middleware = "guest";

export default RequestCode;
