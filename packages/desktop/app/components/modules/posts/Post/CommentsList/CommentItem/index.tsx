import { FC, useState } from "react";
import SendMessage from "../SendMessage";
import Button from "../../../../../common/Button";
import {
  useDeleteComment,
  useEditCommentPost,
  useLikeComment,
} from "shared/graphql/mutation/posts";
import { Comment } from "shared/graphql/query/post/usePost";
import { useAccountContext } from "shared/context/Account";
import Header from "./Header";
import BodyText from "../../PostBody/BodyText";
import LikesModal from "./LikesModal";
import PostAttachment from "../../../PostAttachment";
import { Attachment as AttachmentType } from "shared/graphql/fragments/post";
import { Media } from "../../../EditPostModal/AttachmentPreview/MediaSelector";
import GalleryView from "../../../GalleryView";

interface CommentItemProps {
  comment: Comment;
  onReply?: (
    commentId: string,
    comment: string,
    attachments?: Media[]
  ) => Promise<void>;
}

const CommentItem: FC<CommentItemProps> = ({ comment, onReply }) => {
  const account = useAccountContext();
  const [likeComment] = useLikeComment();
  const [deleteComment] = useDeleteComment();
  const [editComment] = useEditCommentPost();
  const isMyComment = account._id == comment.user._id;
  const isLiked = comment.likes.some((value) => value._id == account._id);
  const [showEditor, setShowEditor] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number>();
  const toggleLike = async () => {
    await likeComment({
      variables: {
        like: !isLiked,
        commentId: comment._id,
      },
    });
  };
  const handleDeleteComment = async () => {
    await deleteComment({ variables: { commentId: comment._id } });
  };
  const handleEditComment = async (message: string, attachments?: Media[]) => {
    try {
      const { data } = await editComment({
        variables: {
          comment: {
            _id: comment._id,
            body: message,
            mentionIds: [], // Implement mentions
            attachments,
          },
        },
      });
      if (data?.editComment) {
        setShowEditor(false);
      }
    } catch (err) {}
  };
  const handleGalleryIndex = (idx: number | undefined) => {
    setGalleryIndex(idx);
  };

  const attachments = comment.attachments;

  return (
    <div>
      <Header
        comment={comment}
        isMyComment={isMyComment}
        onEdit={() => setShowEditor(true)}
        onDelete={handleDeleteComment}
      />
      {showEditor ? (
        <div>
          <SendMessage
            type="edit-comment"
            message={comment.body}
            attachments={attachments}
            commentId={comment._id}
            onSend={handleEditComment}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      ) : (
        <div className="ml-12 mt-2">
          <BodyText text={comment.body} />
          <div className={"max-w-xs rounded-lg overflow-hidden mt-4 mb-2"}>
            {attachments != null && attachments.length > 0 && (
              <div
                className="cursor-pointer"
                onClick={() => handleGalleryIndex(0)}
              >
                <PostAttachment
                  attachment={{ url: attachments[0].url } as AttachmentType}
                  userId={comment.user._id}
                  postId={comment._id}
                  multiple={false}
                  aspectRatio={attachments[0].aspectRatio ?? 1.58}
                />
              </div>
            )}
          </div>

          <div className="flex items-center mt-2">
            <div>
              <Button
                variant="text"
                className="text-xs tracking-normal font-normal text-white/[.87]"
                onClick={toggleLike}
              >
                {isLiked ? "Unlike" : "Like"}
              </Button>
              {onReply && (
                <Button
                  variant="text"
                  className="text-xs tracking-normal font-normal text-white/[.87] ml-3"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  Reply
                </Button>
              )}
            </div>
            {comment.likes.length > 0 && (
              <Button
                variant="text"
                className="text-xs tracking-normal font-normal text-white/[.6] ml-auto"
                onClick={() => setShowLikesModal(true)}
              >
                {comment.likes.length}{" "}
                {comment.likes.length == 1 ? "Like" : "Likes"}
              </Button>
            )}
          </div>
          {showReplyForm && onReply && (
            <div className="mt-2">
              <SendMessage
                type="create-comment"
                onSend={async (message, attachments) => {
                  await onReply(comment._id, message, attachments);
                  setShowReplyForm(false);
                }}
              />
            </div>
          )}
        </div>
      )}
      {showLikesModal && (
        <LikesModal
          likes={comment.likes}
          show={showLikesModal}
          onClose={() => setShowLikesModal(false)}
        />
      )}
      {galleryIndex != undefined && attachments && attachments.length > 0 && (
        <GalleryView
          show={true}
          postId={comment._id}
          userId={comment.user._id}
          images={attachments}
          index={galleryIndex}
          onClose={() => handleGalleryIndex(undefined)}
        />
      )}
    </div>
  );
};

export default CommentItem;
