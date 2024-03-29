import { FC, PropsWithChildren } from "react";
import NextNProgress from "nextjs-progressbar";
import { signOut } from "next-auth/react";
import { AppPageProps } from "../../types/next-page";
import AuthLayout from "./AuthLayout";
import MainLayout from "./MainLayout";
import Background from "./Background";
import { AccountProvider } from "shared/context/Account";
import { ChatProvider } from "shared/context/Chat";
import dynamic from "next/dynamic";
import { useChatToken } from "shared/graphql/query/account/useChatToken";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AnalyticsScripts from "./AnalyticsScripts";
import OnboardingLayout from "./OnboardingLayout";
import { LocalStorage } from "../../lib/storageHelper";
import Head from "next/head";

type RootLayoutProps = PropsWithChildren<AppPageProps> & {
  getstreamKey: string;
};

const RootLayout: FC<RootLayoutProps> = ({
  middleware,
  layout,
  background = layout == "auth" || layout == "onboarding"
    ? "radial"
    : "default",
  children,
  getstreamKey,
}: RootLayoutProps) => {
  const { data: chatData } = useChatToken();

  const appContent = (
    <Background type={background}>
      {layout == "auth" && <AuthLayout>{children}</AuthLayout>}
      {layout == "onboarding" && (
        <OnboardingLayout>{children}</OnboardingLayout>
      )}
      {layout == "main" && (
        <MainLayout fluid={false} fullHeight={false}>
          {children}
        </MainLayout>
      )}
      {layout == "main-fluid" && (
        <MainLayout fluid={true} fullHeight={false}>
          {children}
        </MainLayout>
      )}
      {layout == "main.full-height" && (
        <MainLayout fluid={false} fullHeight={true}>
          {children}
        </MainLayout>
      )}
      {layout == undefined && children}
    </Background>
  );

  return (
    <>
      <Head>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <NextNProgress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ easing: "ease", speed: 500, showSpinner: false }}
        nonce=""
      />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={false}
        className="!w-auto !px-2 !top-8"
        toastClassName="!bg-transparent !mb-0 !p-0"
        bodyClassName="!my-0 !p-0"
      />
      <main>
        {middleware == "auth" ? (
          <AccountProvider
            onUnauthenticated={async () => {
              await signOut();
              LocalStorage.clear();
            }}
          >
            <ChatProvider apiKey={getstreamKey} token={chatData?.chatToken}>
              {appContent}
            </ChatProvider>
          </AccountProvider>
        ) : (
          appContent
        )}
        <AnalyticsScripts />
      </main>
    </>
  );
};

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });
