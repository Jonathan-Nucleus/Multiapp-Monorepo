import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import AuthLayout from "../app/components/layouts/auth";
import { ReactElement } from "react";
import MainLayout from "../app/components/layouts/main";
import PreferencesPage from '../app/components/templates/PreferencesPage'

const Preferences: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Preferences</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PreferencesPage />
    </div>
  );
};

Preferences.getLayout = (page: ReactElement) => {
  return (
    <MainLayout>
      <AuthLayout>{page}</AuthLayout>
    </MainLayout>
  );
};

export default Preferences
