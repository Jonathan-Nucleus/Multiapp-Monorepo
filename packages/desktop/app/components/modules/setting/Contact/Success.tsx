import React, { FC, useMemo, useState } from "react";
import { X, Chats, Phone, Envelope } from "phosphor-react";

import Card from "../../../common/Card";
import Button from "../../../common/Button";

interface SuccesProps {
  onClose: () => void;
}
const Success: FC<SuccesProps> = ({ onClose }: SuccesProps) => {
  return (
    <>
      <div className="p-4 border-y border-brand-overlay/[.1] h-28">
        <div className="text-white">
          Thanks for your request! Someone from our Wealth Management Team will
          contact you.
        </div>
      </div>
      <div className="flex justify-end p-4">
        <Button
          type="button"
          variant="gradient-primary"
          className="w-full md:w-48 uppercase leading-6"
          onClick={() => {
            onClose();
          }}
        >
          close
        </Button>
      </div>
    </>
  );
};

export default Success;
