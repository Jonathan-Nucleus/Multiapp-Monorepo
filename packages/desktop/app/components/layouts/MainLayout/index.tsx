import { FC, PropsWithChildren } from "react";
import Header from "./Header";
import Container from "../Container";

type MainLayoutProps = PropsWithChildren<unknown> & {
  fluid?: boolean;
};

const MainLayout: FC<MainLayoutProps> = ({
  fluid,
  children,
}: MainLayoutProps) => {
  return (
    <div>
      <Header />
      <Container fluid={fluid}>
        {children}
      </Container>
    </div>
  );
};

export default MainLayout;
