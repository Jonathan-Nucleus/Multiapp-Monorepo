import { FC, PropsWithChildren, useEffect, useState } from "react";
import NextNProgress from "nextjs-progressbar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AppAuthOptions from "../../config/auth";
import { AppPageProps } from "../../types/next-page";
import AuthLayout from "./AuthLayout";
import MainLayout from "./MainLayout";
import Background from "./Background";
import { Toaster } from "react-hot-toast";
import { AccountProvider } from "shared/context/Account";

type RootLayoutProps = PropsWithChildren<AppPageProps>;

const RootLayout: FC<RootLayoutProps> = ({
  middleware,
  layout,
  background = layout == "auth" ? "radial" : "default",
  children,
}: RootLayoutProps) => {
  const { status } = useSession();
  const router = useRouter();
  const [routeChangeStarted, setRouteChangeStarted] = useState(false);
  useEffect(() => {
    const onRouteChangeStarted = () => {
      setRouteChangeStarted(true);
    };
    const onRouteChangeCompleted = () => {
      setRouteChangeStarted(false);
    };
    router.events.on("routeChangeStart", onRouteChangeStarted);
    router.events.on("routeChangeComplete", onRouteChangeCompleted);
    return () => {
      router.events.off("routeChangeStart", onRouteChangeStarted);
      router.events.off("routeChangeComplete", onRouteChangeCompleted);
    };
  }, [router]);
  if (!routeChangeStarted && status != "loading") {
    if (middleware == "guest" && status == "authenticated") {
      router.replace("/");
      return <></>;
    }
    if (middleware == "auth" && status == "unauthenticated") {
      router.replace(
        `${AppAuthOptions.pages?.signIn}?redirect=${router.asPath}`
      );
      return <></>;
    }
  }
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
        {status == "loading" || routeChangeStarted ? (
          <></>
        ) : (
          <>
            {middleware == "auth" ? (
              <AccountProvider onUnauthenticated={async () => await signOut()}>
                {appContent}
              </AccountProvider>
            ) : (
              appContent
            )}
          </>
        )}
      </main>
    </>
  );
};

export default RootLayout;
