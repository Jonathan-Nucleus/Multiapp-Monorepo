import { FC } from "react";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import { Transition } from "@headlessui/react";
import ProfileFrames from "shared/assets/images/profile-frames.png";

interface BuildingFeedProps {
  show: boolean;
}

const BuildingFeed: FC<BuildingFeedProps> = ({ show }) => {
  return (
    <>
      <Transition appear={true} show={show}>
        <div className="text-center py-20">
          <Image src={LogoWithText} alt="" width={238} height={42} />
        </div>
        <Transition.Child
          enter="transition-opacity ease-linear duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-white text-center font-medium mt-8">
            Building your feed...
          </div>
          <div className="text-center animate-pulse mt-6">
            <Image src={ProfileFrames} alt="" />
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
};

export default BuildingFeed;
