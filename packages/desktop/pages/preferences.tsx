import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import PreferencesPage from "../app/components/templates/PreferencesPage";

const Preferences: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Preferences</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <PreferencesPage />
    </div>
  );
};

Preferences.layout = "auth";
Preferences.middleware = "guest";

export default Preferences;
