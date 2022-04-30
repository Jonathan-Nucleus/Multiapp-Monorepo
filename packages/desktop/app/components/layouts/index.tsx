import { FC, PropsWithChildren, useEffect, useState } from "react";
import NextNProgress from "nextjs-progressbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AppAuthOptions from "../../config/auth";
import { AppPageProps } from "../../types/next-page";
import AuthLayout from "./AuthLayout";
import MainLayout from "./MainLayout";
import styles from "./index.module.css";

type RootLayoutProps = PropsWithChildren<AppPageProps>;

const RootLayout: FC<RootLayoutProps> = ({
  middleware,
  layout,
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
      <main className={styles.main}>
        {(status == "loading" || routeChangeStarted) ?
          <></>
          :
          <>
            {layout == "auth" && <AuthLayout>{children}</AuthLayout>}
            {layout == "main" && <MainLayout>{children}</MainLayout>}
            {layout == undefined && children}
          </>
        }
      </main>
    </>
  );
};

export default RootLayout;