import React, { FC, useMemo, useState } from "react";
import { X, Chats, Phone, Envelope } from "phosphor-react";

import { Dialog } from "@headlessui/react";
import Card from "../../../common/Card";
import Button from "../../../common/Button";
import ContactPhone from "./Phone";
import ContactEmail from "./Email";
import Success from "./Success";
import { useHelpRequest } from "mobile/src/graphql/mutation/account";
import { useFunds } from "mobile/src/graphql/query/marketplace/useFunds";

interface ContactusModalProps {
  show: boolean;
  onClose: () => void;
}

type HelpRequestVariables = {
  request: {
    type: string;
    email?: string;
    phone?: string;
    fundId: string;
    message: string;
    preferredTimeOfDay?: string;
  };
};

const ContactusModal: FC<ContactusModalProps> = ({
  show,
  onClose,
}: ContactusModalProps) => {
  const [type, setType] = useState("");
  const [helpRequest] = useHelpRequest();
  const { data } = useFunds();

  const FUNDS = useMemo(() => {
    if (data?.funds && data?.funds?.length > 0) {
      return data?.funds?.map((v) => ({
        label: v.name,
        value: v._id,
      }));
    }
    return [];
  }, [data]);

  const handleContact = async (value: HelpRequestVariables) => {
    try {
      const { data: requestData } = await helpRequest({
        variables: value,
      });
      if (requestData?.helpRequest) {
        setType("success");
      }
    } catch (e) {
      console.error("contact error", e);
    }
  };

  return (
    <>
      <Dialog
        open={show}
        onClose={() => {
          onClose();
          setType("");
        }}
        className="fixed z-10 inset-0"
      >
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card
            className={
              "flex flex-col border-0 max-h-full min-h-0 mx-auto p-0 z-10 w-full max-w-xl rounded overflow-y-auto"
            }
          >
            <div className="flex items-center justify-between p-4 border-b border-brand-overlay/[.1]">
              <div className="text-xl text-white font-medium tracking-wider">
                Contact Fund Specialist
              </div>
              <Button variant="text" className="opacity-60">
                <X
                  color="white"
                  weight="bold"
                  size={24}
                  onClick={() => {
                    onClose();
                    setType("");
                  }}
                />
              </Button>
            </div>
            <div className="px-4 mb-6">
              <div className="text-sm text-white mb-4">
                How would you like to be contacted?
              </div>
              <div className="flex-grow grid grid-cols-3 rounded-full border border-primary-solid divide-x divide-inherit">
                <div
                  className={
                    "flex p-2 justify-center items-center cursor-pointer " +
                    (type === "phone" && "bg-primary-solid rounded-l-full")
                  }
                  onClick={() => setType("phone")}
                >
                  <Phone color="white" size={22} />
                  <div className="text-white uppercase ml-2">Phone</div>
                </div>
                <div
                  className={
                    "flex p-2 justify-center items-center cursor-pointer " +
                    (type === "email" && "bg-primary-solid")
                  }
                  onClick={() => setType("email")}
                >
                  <Envelope color="white" size={22} />
                  <div className="text-white uppercase ml-2">email</div>
                </div>
                <div
                  className={
                    "flex p-2 justify-center items-center cursor-pointer " +
                    (type === "chat" && "bg-primary-solid rounded-r-full")
                  }
                  onClick={() => setType("chat")}
                >
                  <Chats color="white" size={22} />
                  <div className="text-white uppercase ml-2">chat</div>
                </div>
              </div>
            </div>
            {type === "phone" && (
              <ContactPhone handleContact={handleContact} FUNDS={FUNDS} />
            )}
            {type === "email" && (
              <ContactEmail handleContact={handleContact} FUNDS={FUNDS} />
            )}
            {type === "success" && <Success onClose={onClose} />}
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default ContactusModal;
