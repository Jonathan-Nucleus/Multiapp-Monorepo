import { NextPageWithLayout } from "../../app/types/next-page";
import Head from "next/head";
import FundManagersPage from "../../app/components/templates/Funds/FundManagersPage";

const FundManagers: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Fund Managers - Prometheus</title>
        <meta name="description" content="" />
      </Head>
      <FundManagersPage />
    </div>
  );
};

FundManagers.layout = "main-fluid";
FundManagers.middleware = "auth";

export default FundManagers;
