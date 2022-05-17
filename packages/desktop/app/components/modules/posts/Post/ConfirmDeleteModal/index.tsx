import { FC, useState } from "react";
import Button from "../../../../common/Button";
import ModalDialog from "../../../../common/ModalDialog";
import { DialogProps } from "../../../../../types/common-props";
import { useDeletePost } from "shared/graphql/mutation/posts/useDeletePost";

interface ConfirmDeleteModalProps extends DialogProps {
  postId: string;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({ postId, show, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [deletePost] = useDeletePost();
  return (
    <>
      <ModalDialog
        title={"Are you sure to delete this post?"}
        className="w-96 max-w-full"
        show={show}
        onClose={onClose}
      >
        <>
          <div className="flex items-center justify-between px-8 py-5">
            <Button
              variant="outline-primary"
              className="w-24"
              onClick={onClose}
            >
              No
            </Button>
            <Button
              variant="primary"
              className="w-24"
              loading={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await deletePost({ variables: { postId }});
                } catch (e) {
                }
                setLoading(false);
                onClose();
              }}
            >
              Yes
            </Button>
          </div>
        </>
      </ModalDialog>
    </>
  );
};

export default ConfirmDeleteModal;