import { NextPageWithLayout } from "../../app/types/next-page";
import Head from "next/head";
import FundManagersPage from "../../app/components/templates/FundManagersPage";

const FundManagers: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Fund Managers - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FundManagersPage />
    </div>
  );
};

FundManagers.layout = "main";
FundManagers.middleware = "auth";

export default FundManagers;
