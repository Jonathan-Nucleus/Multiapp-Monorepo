import { Transition } from "@headlessui/react";
import { FC } from "react";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";

interface AnimatingLogoProps {
  show: boolean;
}

const AnimatingLogo: FC<AnimatingLogoProps> = ({ show }) => {
  return (
    <>
      <Transition
        appear={true}
        show={show}
        enter="transition-all ease-out duration-1000"
        enterFrom="translate-y-0"
        enterTo="translate-y-verticalCenter"
      >
        <div className="text-center py-20">
          <Image src={LogoWithText} alt="" width={238} height={42} />
        </div>
      </Transition>
    </>
  );
};

export default AnimatingLogo;
