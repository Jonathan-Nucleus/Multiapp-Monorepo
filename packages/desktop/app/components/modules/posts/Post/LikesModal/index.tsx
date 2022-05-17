import { User } from "backend/graphql/users.graphql";
import React, { FC } from "react";
import ModalDialog from "../../../../common/ModalDialog";
import UserItem from "../../../users/UserItem";

interface LikesModalProps {
  show: boolean;
  onClose: () => void;
  members: User[];
}

const LikesModal: FC<LikesModalProps> = ({ show, onClose, members }) => {
  return (
    <>
      <ModalDialog
        title="People Who Liked This Post"
        className="h-[80vh] flex-grow"
        show={show}
        onClose={onClose}
      >
        <div>
          <div className="flex flex-col flex-grow  max-w-full md:min-h-0 p-4 overflow-y-auto">
            {members.map((member, index) => (
              <div key={index} className="py-3">
                <UserItem user={member} />
              </div>
            ))}
          </div>
        </div>
      </ModalDialog>
    </>
  );
};

export default LikesModal;