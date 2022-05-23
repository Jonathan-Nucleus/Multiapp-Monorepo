import { FC } from "react";
import { Chats, EnvelopeSimple, Phone } from "phosphor-react";

export type ContactType = "PHONE" | "EMAIL";

interface ContactOptionsProps {
  type?: ContactType;
  setType: (type?: ContactType) => void;
}

const ContactOptions: FC<ContactOptionsProps> = ({ type, setType }) => {
  return (
    <div className="px-5 py-4">
      <div className="text-white">How would you like to be contacted?</div>
      <div className="mt-5">
        <div className="border border-primary-solid rounded-full overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-primary-solid">
            <div
              className={`flex items-center justify-center hover:bg-primary-solid/[.25] ${
                type == "PHONE" ? "bg-primary-highlight" : ""
              } cursor-pointer py-2`}
              onClick={() => setType("PHONE")}
            >
              <Phone
                color="currentColor"
                size={24}
                weight="bold"
                className="text-white"
              />
              <div className="text-sm text-white font-medium ml-2">Phone</div>
            </div>
            <div
              className={`flex items-center justify-center hover:bg-primary-solid/[.25] ${
                type == "EMAIL" ? "bg-primary-highlight" : ""
              } cursor-pointer py-2`}
              onClick={() => setType("EMAIL")}
            >
              <EnvelopeSimple
                color="currentColor"
                size={24}
                weight="bold"
                className="text-white"
              />
              <div className="text-sm text-white font-medium ml-2">Email</div>
            </div>
            <div className="flex items-center justify-center hover:bg-primary-solid/[.25] cursor-pointer py-2">
              <Chats
                color="currentColor"
                size={24}
                weight="bold"
                className="text-white"
              />
              <div className="text-sm text-white font-medium ml-2">Chat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactOptions;
