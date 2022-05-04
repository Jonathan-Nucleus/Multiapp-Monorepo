import { FC, PropsWithChildren } from "react";
import Header from "./Header";

type MainLayoutProps = PropsWithChildren<unknown>;

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="max-w-screen-2xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
