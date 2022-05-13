import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";

const Settings: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Search - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

Settings.layout = "main";
Settings.middleware = "auth";

export default Settings;
