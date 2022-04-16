import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import MessagesPage from "../app/components/templates/MessagesPage";

const Messages: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Messages</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MessagesPage />
    </div>
  );
};

Messages.layout = "main";
Messages.middleware = "auth";

export default Messages;
