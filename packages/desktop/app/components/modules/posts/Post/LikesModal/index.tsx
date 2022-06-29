import React, { FC } from "react";
import ModalDialog from "../../../../common/ModalDialog";
import UserItem from "../../../users/UserItem";
import { DialogProps } from "desktop/app/types/common-props";
import { usePostLikes } from "shared/graphql/query/post/usePostLikes";
import Spinner from "../../../../common/Spinner";

interface LikesModalProps extends DialogProps {
  postId: string;
}

const LikesModal: FC<LikesModalProps> = ({ postId, show, onClose }) => {
  const { data, loading } = usePostLikes(postId);
  const likes = data?.post.likes;
  return (
    <>
      <ModalDialog
        title="People Who Liked This Post"
        className="flex flex-col w-full max-w-lg h-[80vh]"
        show={show}
        onClose={onClose}
      >
        <div className="min-h-0 overflow-y-auto p-4">
          {loading && (
            <div className="text-center my-10">
              <Spinner />
            </div>
          )}
          {likes &&
            likes.map((member, index) => (
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
