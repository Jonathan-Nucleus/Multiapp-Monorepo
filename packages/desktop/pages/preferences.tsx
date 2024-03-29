import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import PreferencesPage from "../app/components/templates/PreferencesPage";

const Preferences: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Preferences</title>
        <meta name="description" content="" />
      </Head>
      <PreferencesPage />
    </div>
  );
};

Preferences.layout = "onboarding";
Preferences.middleware = "auth";

export default Preferences;
