import React, { FC, useState } from "react";
import ModalDialog from "../../../common/ModalDialog";
import { DialogProps } from "../../../../types/common-props";
import ContactOptions, { ContactType } from "./ContactOptions";
import ContactPhone from "./ContactPhone";
import { useFunds } from "shared/graphql/query/marketplace/useFunds";
import ContactEmail from "./ContactEmail";
import Button from "../../../common/Button";

interface ContactSpecialistProps extends DialogProps {}

const ContactSpecialist: FC<ContactSpecialistProps> = ({ show, onClose }) => {
  const [contactType, setContactType] = useState<ContactType | undefined>(
    "EMAIL"
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: { funds = [] } = {} } = useFunds();
  return (
    <>
      <ModalDialog
        title="Contact Fund Specialist"
        className="w-full max-w-lg"
        show={show}
        onClose={onClose}
      >
        <div>
          {!showSuccess && (
            <div className="min-h-[200px]">
              {contactType == "PHONE" && (
                <ContactPhone
                  funds={funds}
                  onBack={() => setContactType(undefined)}
                  onComplete={() => {
                    setContactType(undefined);
                    setShowSuccess(true);
                  }}
                />
              )}
              {contactType == "EMAIL" && (
                <ContactEmail
                  funds={funds}
                  onBack={() => setContactType(undefined)}
                  onComplete={() => {
                    setContactType(undefined);
                    setShowSuccess(true);
                  }}
                />
              )}
            </div>
          )}
          {showSuccess && (
            <>
              <div className="text-white px-5 py-4">
                Thanks for your request! Someone from our Wealth Management Team
                will contact you.
              </div>
              <div className="text-right border-t border-white/[.12] px-5 py-4">
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-28 text-white"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </ModalDialog>
    </>
  );
};

export default ContactSpecialist;
