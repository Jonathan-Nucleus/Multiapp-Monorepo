import Head from "next/head";
import getConfig from "next/config";
import { NextPageWithLayout } from "../app/types/next-page";
import MessagesPage from "../app/components/templates/MessagesPage";

const { publicRuntimeConfig = {} } = getConfig();
const { NEXT_PUBLIC_GETSTREAM_ACCESS_KEY } = publicRuntimeConfig;

const Messages: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Messages</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MessagesPage apiKey={NEXT_PUBLIC_GETSTREAM_ACCESS_KEY} />
    </div>
  );
};

Messages.layout = "main";
Messages.middleware = "auth";

// Enable use of next/config for get stream API key
export function getInitialProps() {}

export default Messages;
