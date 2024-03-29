import Head from "next/head";
import AdminPage from "../app/frontend/components/templates/AdminPage";
import { NextPageWithLayout } from "../app/types/next-page";

const Admin: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Admin - Prometheus</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AdminPage />
    </div>
  );
};

Admin.layout = "main";
Admin.middleware = "auth";

export default Admin;
