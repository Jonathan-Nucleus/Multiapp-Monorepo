import Head from "next/head";
import NotificationPage from "../app/components/templates/NotificationList";
import { NextPageWithLayout } from "../app/types/next-page";

const Notification: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Notification - Prometheus</title>
        <meta name="description" content="Prometheus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NotificationPage />
    </div>
  );
};

Notification.layout = "main";
Notification.middleware = "auth";

export default Notification;
