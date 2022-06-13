import React, {
  FC,
  Fragment,
  PropsWithChildren,
  ReactNode,
  HTMLProps,
  useState,
} from "react";
import { Transition } from "@headlessui/react";
import { CaretDown, CaretUp } from "phosphor-react";
import Button from "../Button";

type AccordianProps = PropsWithChildren<
  HTMLProps<HTMLDivElement> & {
    title: ReactNode;
    titleClassName?: string;
  }
>;

const Accordian: FC<AccordianProps> = ({
  title,
  titleClassName,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleView = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div {...props}>
      <div
        className="flex flex-row cursor-pointer items-center"
        onClick={toggleView}
      >
        <div className="text-white m-4 ml-0">
          {isOpen ? (
            <CaretUp color="currentColor" size={24} />
          ) : (
            <CaretDown color="currentColor" size={24} />
          )}
        </div>
        <div className={titleClassName}>{title}</div>
      </div>
      <Transition
        show={isOpen}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {children}
      </Transition>
    </div>
  );
};

export default Accordian;
