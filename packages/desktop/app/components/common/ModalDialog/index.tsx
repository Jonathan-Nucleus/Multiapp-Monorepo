import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, PropsWithChildren, ReactNode } from "react";
import { X } from "phosphor-react";
import Button from "../Button";

type ModalDialogProps = PropsWithChildren<{
  title?: ReactNode;
  titleClass?: string;
  className?: string;
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
          onClose={() => {}}
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
            <div className="fixed inset-0 bg-black opacity-70" />
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
                  className={
                    "bg-background-card rounded shadow-sm " + (className ?? "")
                  }
                >
                  {title && (
                    <Dialog.Title className="flex items-center border-b border-white/[.12] px-5 py-3 text-white">
                      <div className={titleClass ?? "text-xl font-medium"}>
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
                  )}
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
