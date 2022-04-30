import React, { FC, useState } from "react";
import { X } from "phosphor-react";

import { Dialog } from "@headlessui/react";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Success from "../Contact/Success";
import BecomeForm from "./BecomeForm";

interface BecomeProModalProps {
  show: boolean;
  onClose: () => void;
}

const BecomeProModal: FC<BecomeProModalProps> = ({
  show,
  onClose,
}: BecomeProModalProps) => {
  const [success, setSuccess] = useState(false);

  return (
    <>
      <Dialog
        open={show}
        onClose={() => {
          onClose();
          setSuccess(false);
        }}
        className="fixed z-10 inset-0"
      >
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card
            className={
              "flex flex-col border-0 mx-auto p-0 z-10 w-full max-w-xl rounded overflow-y-auto " +
              (success ? "h-auto" : "h-3/4")
            }
          >
            <div className="flex items-center justify-between p-4 border-b border-brand-overlay/[.1]">
              <div className="text-xl text-white font-medium tracking-wider">
                Become a Pro
              </div>
              <Button variant="text" className="opacity-60">
                <X
                  color="white"
                  weight="bold"
                  size={24}
                  onClick={() => {
                    onClose();
                    setSuccess(false);
                  }}
                />
              </Button>
            </div>
            {success ? (
              <Success
                onClose={() => {
                  onClose();
                  setSuccess(false);
                }}
              />
            ) : (
              <BecomeForm setSuccess={() => setSuccess(true)} />
            )}
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default BecomeProModal;
