import { Transition } from "@headlessui/react";
import { FC, useEffect, useState } from "react";
import { Comment } from "shared/graphql/query/post/usePost";
import SendMessage from "./SendMessage";
import CommentItem from "./CommentItem";
import { useCommentPost } from "shared/graphql/mutation/posts";
import { parseMentions } from "shared/src/patterns";
import Spinner from "../../../../common/Spinner";
import { usePostComments } from "shared/graphql/query/post/usePostComments";
import { Media } from "../../EditPostModal/AttachmentPreview/MediaSelector";

interface CommentsListProps {
  show: boolean;
  postId: string;
}

const CommentsList: FC<CommentsListProps> = ({ show, postId }) => {
  const { data: { post } = {}, refetch } = usePostComments(postId);
  const [commentPost] = useCommentPost();
  const [comments, setComments] = useState<
    (Comment & { comments: Comment[] })[]
  >([]);
  useEffect(() => {
    if (post) {
      const comments = post.comments.filter((comment) => !comment.commentId);
      setComments(
        comments.map((comment) => {
          const nestedComments = post.comments.filter(
            (item) => item.commentId == comment._id
          );
          return {
            ...comment,
            comments: nestedComments,
          };
        })
      );
    }
  }, [post]);
  const addNewComment = async (message: string, attachments?: Media[]) => {
    await commentPost({
      variables: {
        comment: {
          body: message,
          postId,
          mentionIds: parseMentions(message),
          attachments,
        },
      },
    });
    await refetch();
  };
  const replyToComment = async (
    commentId: string,
    message: string,
    attachments?: Media[]
  ) => {
    await commentPost({
      variables: {
        comment: {
          body: message,
          commentId,
          postId,
          mentionIds: parseMentions(message),
          attachments,
        },
      },
    });
    await refetch();
  };

  if (!post) {
    return (
      <div className="text-center px-4 py-5">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Transition
        show={show}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="px-4 pb-5 relative">
          <div className="py-3">
            <SendMessage
              type="create-comment"
              placeholder="Add a comment..."
              onSend={addNewComment}
            />
          </div>
          {comments.map((comment) => (
            <div key={comment._id} className="pb-4">
              <div
                className={`relative ${
                  comment.comments.length == 0 ? "after:hidden" : ""
                } after:w-8 after:border-elevation-overlay after:border-l-2 after:absolute after:left-4 after:top-9 after:-bottom-4`}
              >
                <CommentItem comment={comment} onReply={replyToComment} />
              </div>
              {comment.comments.length > 0 && (
                <div className="ml-12 mt-4">
                  {comment.comments.map((nestedComment, index) => (
                    <div
                      key={nestedComment._id}
                      className="relative before:absolute before:w-8 before:-left-8 before:border-elevation-overlay before:border-l-2 before:border-b-2 before:h-[18px] before:rounded-bl-2xl"
                    >
                      <div
                        className={`${
                          index == comment.comments.length - 1
                            ? "before:hidden"
                            : ""
                        } before:absolute before:w-8 before:-left-8 before:top-0 before:bottom-0 before:border-elevation-overlay before:border-l-2`}
                      >
                        <CommentItem comment={nestedComment} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Transition>
    </>
  );
};

export default CommentsList;
