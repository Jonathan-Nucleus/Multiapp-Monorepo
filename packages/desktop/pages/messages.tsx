import Head from "next/head";
import { NextPageWithLayout } from "../app/types/next-page";
import MessagesPage from "../app/components/templates/MessagesPage";
import { useRouter } from "next/router";

const Messages: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = router.query as Record<string, string>;
  return (
    <div className="h-full">
      <Head>
        <title>Messages</title>
        <meta name="description" content="" />
      </Head>
      <MessagesPage user={user} />
    </div>
  );
};

Messages.layout = "main.full-height";
Messages.middleware = "auth";

export default Messages;
