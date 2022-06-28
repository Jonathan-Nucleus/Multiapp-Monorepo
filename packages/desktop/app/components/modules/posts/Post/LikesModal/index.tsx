import React, { FC } from "react";
import ModalDialog from "../../../../common/ModalDialog";
import UserItem, { UserType } from "../../../users/UserItem";
import { DialogProps } from "desktop/app/types/common-props";

interface LikesModalProps extends DialogProps {
  title: string;
  members: UserType[];
}

const LikesModal: FC<LikesModalProps> = ({ title, show, onClose, members }) => {
  return (
    <>
      <ModalDialog
        title={title}
        className="flex flex-col w-full max-w-lg h-[80vh]"
        show={show}
        onClose={onClose}
      >
        <div className="min-h-0 overflow-y-auto p-4">
          {members.map((member, index) => (
            <div key={index} className="py-3">
              <UserItem user={member} />
            </div>
          ))}
        </div>
      </ModalDialog>
    </>
  );
};

export default LikesModal;
