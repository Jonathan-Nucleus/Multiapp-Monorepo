import { FC } from "react";
import Logo from "shared/assets/images/logo.svg";
import Image from "next/image";

const AuthLayout: FC = ({ children }) => {
  return (
    <div className="container mx-auto">
      <div className="py-16 text-center">
        <Image src={Logo} alt="" layout={"intrinsic"} />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
