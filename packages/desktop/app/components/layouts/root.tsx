import { FC, PropsWithChildren } from "react";
import NextNProgress from "nextjs-progressbar";
import styles from "./root.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AppAuthOptions from "../../config/auth";

type RootLayoutProps = PropsWithChildren<{
  middleware?: "auth" | "guest";
}>;

const RootLayout: FC<RootLayoutProps> = ({
  middleware,
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
      <main className={styles.rootContainer}>{children}</main>
    </>
  );
};

export default RootLayout;
