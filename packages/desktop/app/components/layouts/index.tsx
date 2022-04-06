import { FC, PropsWithChildren } from "react";
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
  const { data: session } = useSession();
  const router = useRouter();
  if (middleware == "guest" && session) {
    if (typeof window === "undefined") return null;
    router.replace("/");
    return <></>;
  } else if (middleware == "auth" && !session) {
    if (typeof window === "undefined") return null;
    router.replace(`${AppAuthOptions.pages?.signIn}?redirect=${router.asPath}`);
    return <></>;
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
        {layout == "auth" && <AuthLayout>{children}</AuthLayout>}
        {layout == "main" && <MainLayout>{children}</MainLayout>}
        {layout == undefined && children}
      </main>
    </>
  );
};

export default RootLayout;
