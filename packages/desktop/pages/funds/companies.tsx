import { NextPageWithLayout } from "../../app/types/next-page";
import Head from "next/head";
import CompaniesPage from "../../app/components/templates/Funds/CompaniesPage";

const Companies: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Companies - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CompaniesPage />
    </div>
  );
};

Companies.layout = "main-fluid";
Companies.middleware = "auth";

export default Companies;
