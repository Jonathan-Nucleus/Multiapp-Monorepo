import { FC, PropsWithChildren } from "react";
import Container from "../Container";

type MainLayoutProps = PropsWithChildren<unknown> & {
  fluid: boolean;
  fullHeight: boolean;
};

const MainLayout: FC<MainLayoutProps> = ({
  fluid,
  fullHeight,
  children,
}: MainLayoutProps) => {
  return (
    <div className={`${fullHeight ? "flex flex-col h-screen" : ""}`}>
      <div className="w-full flex-grow min-h-0">
        <Container fluid={fluid} className="h-full">
          {children}
        </Container>
      </div>
    </div>
  );
};

export default MainLayout;
