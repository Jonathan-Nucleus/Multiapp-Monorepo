import { FC, PropsWithChildren } from "react";
import dynamic from "next/dynamic";
import { signOut, useSession } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";

import { AppPageProps } from "../../../types/next-page";
import AuthLayout from "./AuthLayout";
import MainLayout from "./MainLayout";
import Background from "./Background";
import "react-toastify/dist/ReactToastify.css";

type RootLayoutProps = PropsWithChildren<AppPageProps>;

const RootLayout: FC<RootLayoutProps> = ({
  middleware,
  layout,
  background = layout == "auth" ? "radial" : "default",
  children,
}: RootLayoutProps) => {
  const session = useSession();
  const appContent = (
    <Background type={background}>
      {layout == "auth" && <AuthLayout>{children}</AuthLayout>}
      {layout == "main" && (
        <MainLayout fullHeight={false}>{children}</MainLayout>
      )}
      {layout == "main-fluid" && (
        <MainLayout fullHeight={false}>{children}</MainLayout>
      )}
      {layout == "main.full-height" && (
        <MainLayout fullHeight={true}>{children}</MainLayout>
      )}
      {layout == undefined && children}
    </Background>
  );

  if (middleware === "auth" && session.status === "unauthenticated") {
    signOut();
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
      <main>{appContent}</main>
    </>
  );
};

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });
