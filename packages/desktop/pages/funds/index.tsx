import Head from "next/head";
import FundsPage from "../../app/components/templates/Funds/FundsPage";
import { NextPageWithLayout } from "../../app/types/next-page";

const Funds: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Funds - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <FundsPage />
    </div>
  );
};

Funds.layout = "main";
Funds.middleware = "auth";

export default Funds;
