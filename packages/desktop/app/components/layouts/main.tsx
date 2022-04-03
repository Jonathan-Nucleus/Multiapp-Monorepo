import { FC } from "react";
import NextNProgress from "nextjs-progressbar";
import styles from "./main.module.css";

const MainLayout: FC = ({ children }) => {
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
      <main className={styles.mainContainer}>{children}</main>
    </>
  );
};

export default MainLayout;
