import Head from "next/head";
import HomePage from "../app/components/templates/HomePage";
import { NextPageWithLayout } from "../app/types/next-page";

const Home: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Home - Prometheus</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </div>
  );
};

Home.layout = "main";
Home.middleware = "auth";

export default Home;
