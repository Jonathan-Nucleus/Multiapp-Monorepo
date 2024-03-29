import Head from "next/head";
import SystemPage from "../app/frontend/components/templates/SystemPage";
import { NextPageWithLayout } from "../app/types/next-page";

const System: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>System - Prometheus</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SystemPage />
    </div>
  );
};

System.layout = "main";
System.middleware = "auth";

export default System;
