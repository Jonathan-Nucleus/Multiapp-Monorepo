import { FC } from "react";
import Header from "./Header";

const MainLayout: FC = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
