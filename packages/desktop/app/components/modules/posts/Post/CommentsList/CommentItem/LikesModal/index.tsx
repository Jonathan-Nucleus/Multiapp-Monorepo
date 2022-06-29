import React, { FC } from "react";
import ModalDialog from "desktop/app/components/common/ModalDialog";
import UserItem from "desktop/app/components/modules/users/UserItem";
import { DialogProps } from "desktop/app/types/common-props";
import { Comment } from "shared/graphql/query/post/usePost";

interface LikesModalProps extends DialogProps {
  likes: Comment["likes"];
}

const LikesModal: FC<LikesModalProps> = ({ likes, show, onClose }) => {
  return (
    <>
      <ModalDialog
        title="People Who Liked This Comment"
        className="flex flex-col w-full max-w-lg h-[80vh]"
        show={show}
        onClose={onClose}
      >
        <div className="min-h-0 overflow-y-auto p-4">
          {likes.map((member, index) => (
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
