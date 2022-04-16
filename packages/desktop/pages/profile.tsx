import Head from "next/head";
import ProfilePage from "../app/components/templates/ProfilePage";
import { NextPageWithLayout } from "../app/types/next-page";

const Profile: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Profile - Prometheus</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <ProfilePage />
    </div>
  );
};

Profile.layout = "main";
Profile.middleware = "auth";

export default Profile;
