import { FC, useState } from "react";
import Button from "../../../../../common/Button";
import { signOut } from "next-auth/react";
import ModalDialog from "../../../../../common/ModalDialog";
import { DialogProps } from "desktop/app/types/common-props";

const SignOutModal: FC<DialogProps> = ({ show, onClose }) => {
  const [loading, setLoading] = useState(false);
  return (
    <ModalDialog
      title={"Are you sure to logout?"}
      className="w-96 max-w-full"
      show={show}
      onClose={onClose}
    >
      <>
        <div className="flex items-center justify-between px-8 py-5">
          <Button variant="outline-primary" className="w-24" onClick={onClose}>
            No
          </Button>
          <Button
            variant="primary"
            className="w-24"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              await signOut();
              localStorage.clear();
            }}
          >
            Yes
          </Button>
        </div>
      </>
    </ModalDialog>
  );
};

export default SignOutModal;
