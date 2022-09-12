import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, PropsWithChildren } from "react";
import { X } from "phosphor-react";
import Button from "../Button";

type ModalDialogProps = PropsWithChildren<{
  titleClass?: string;
  className?: string;
  title: string;
  show: boolean;
  onClose: () => void;
}>;

const ModalDialog: FC<ModalDialogProps> = ({
  title,
  titleClass,
  className,
  show,
  onClose,
  children,
}: ModalDialogProps) => {
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          unmount={true}
          open={show}
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray opacity-70" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className={"bg-white rounded shadow-sm " + (className ?? "")}
                >
                  <Dialog.Title className="flex items-center border-b border-white/[.12] px-5 py-3 text-black">
                    <div
                      className={
                        titleClass ?? "flex flex-row text-xl font-medium"
                      }
                    >
                      <p className="font-medium text-blue-600 capitalize">
                        {title}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Button
                        variant="text"
                        className="opacity-90"
                        onClick={onClose}
                      >
                        <X color="#000" weight="bold" size={20} />
                      </Button>
                    </div>
                  </Dialog.Title>

                  <>{children}</>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalDialog;
