import { NextPageWithLayout } from "../../app/types/next-page";
import Head from "next/head";
import FundProfilePage from "../../app/components/templates/Funds/FundProfilePage";

const FundProfile: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Fund Profile - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <FundProfilePage />
    </>
  );
};

FundProfile.layout = "main";
FundProfile.middleware = "auth";

export default FundProfile;
