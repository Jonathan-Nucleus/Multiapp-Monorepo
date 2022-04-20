import { FC, PropsWithChildren } from "react";
import Header from "./Header";

type MainLayoutProps = PropsWithChildren<unknown>;

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
