import Head from "next/head";
import UsersPage from "../app/frontend/components/templates/UsersPage";
import { NextPageWithLayout } from "../app/types/next-page";

const Users: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Users - Prometheus</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <UsersPage />
    </div>
  );
};

Users.layout = "main";
Users.middleware = "auth";

export default Users;
