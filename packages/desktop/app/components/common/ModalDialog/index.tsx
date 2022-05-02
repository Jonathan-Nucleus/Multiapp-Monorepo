import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, PropsWithChildren, ReactNode } from "react";
import { X } from "phosphor-react";
import Button from "../Button";

type ModalDialogProps = PropsWithChildren<{
  title?: ReactNode;
  className?: string;
  show: boolean;
  onClose: () => void;
}>;

const ModalDialog: FC<ModalDialogProps> = ({
  title,
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
          className="fixed inset-0 z-20 overflow-y-auto"
          unmount={true}
          open={show}
          onClose={() => {}}
        >
          <div className="h-screen flex items-center justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={className ?? "bg-background-card max-w-md rounded"}>
                {title &&
                  <Dialog.Title className="flex items-center border-b border-white/[.12] px-5 py-3">
                    <div className="text-xl font-medium">
                      {title}
                    </div>
                    <div className="ml-auto">
                      <Button
                        variant="text"
                        className="opacity-60"
                        onClick={onClose}
                      >
                        <X color="white" weight="bold" size={24} />
                      </Button>
                    </div>
                  </Dialog.Title>
                }
                <>{children}</>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalDialog;