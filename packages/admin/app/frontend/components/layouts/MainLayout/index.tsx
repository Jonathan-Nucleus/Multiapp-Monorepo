import { FC, PropsWithChildren } from "react";
import NavMenu from "../NavMenu";

type MainLayoutProps = PropsWithChildren<unknown> & {
  fullHeight: boolean;
};

const MainLayout: FC<MainLayoutProps> = ({
  fullHeight,
  children,
}: MainLayoutProps) => {
  return (
    <div className={`${fullHeight ? "flex flex-col h-screen" : ""}`}>
      <div className="flex flex-row w-screen bg-gray-50">
        <NavMenu />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
