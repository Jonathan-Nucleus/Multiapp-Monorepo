import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import SettingsPage from "../app/components/templates/SettingsPage";

const Settings: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Settings - Prometheus</title>
        <meta name="description" content="" />
      </Head>
      <SettingsPage />
    </div>
  );
};

Settings.layout = "main";
Settings.middleware = "auth";

export default Settings;
