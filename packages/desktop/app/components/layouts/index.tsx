import { FC, PropsWithChildren } from "react";
import NextNProgress from "nextjs-progressbar";
import { signOut } from "next-auth/react";
import { AppPageProps } from "../../types/next-page";
import AuthLayout from "./AuthLayout";
import MainLayout from "./MainLayout";
import Background from "./Background";
import { Toaster } from "react-hot-toast";
import { AccountProvider } from "shared/context/Account";
import { ChatProvider } from "desktop/app/components/providers/ChatProvider";
import dynamic from "next/dynamic";
import { useChatToken } from "shared/graphql/query/account/useChatToken";

type RootLayoutProps = PropsWithChildren<AppPageProps>;

const RootLayout: FC<RootLayoutProps> = ({
  middleware,
  layout,
  background = layout == "auth" ? "radial" : "default",
  children,
}: RootLayoutProps) => {
  const { data: chatData } = useChatToken();

  const appContent = (
    <Background type={background}>
      {layout == "auth" && <AuthLayout>{children}</AuthLayout>}
      {layout == "main" && <MainLayout fluid={false}>{children}</MainLayout>}
      {layout == "main-fluid" && (
        <MainLayout fluid={true}>{children}</MainLayout>
      )}
      {layout == undefined && children}
    </Background>
  );

  return (
    <>
      <NextNProgress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ easing: "ease", speed: 500, showSpinner: false }}
        nonce=""
      />
      <Toaster />
      <main>
        {middleware == "auth" ? (
          <AccountProvider
            onUnauthenticated={async () => {
              await signOut();
              localStorage.clear();
            }}
          >
            <ChatProvider apiKey="tr4bpwdeccc6" token={chatData?.chatToken}>
              {appContent}
            </ChatProvider>
          </AccountProvider>
        ) : (
          appContent
        )}
      </main>
    </>
  );
};

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });
