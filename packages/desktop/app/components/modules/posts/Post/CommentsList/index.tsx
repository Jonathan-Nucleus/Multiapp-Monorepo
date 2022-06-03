import { Transition } from "@headlessui/react";
import { FC, useEffect, useState } from "react";
import { Comment, usePost } from "shared/graphql/query/post/usePost";
import SendMessage from "./SendMessage";
import CommentItem from "./CommentItem";
import { useCommentPost } from "shared/graphql/mutation/posts";
import Spinner from "../../../../common/Spinner";

interface CommentsListProps {
  show: boolean;
  postId: string;
}

const CommentsList: FC<CommentsListProps> = ({ show, postId }) => {
  const { data: { post } = {}, refetch } = usePost(postId);
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
  const addNewComment = async (message: string, mediaUrl?: string) => {
    await commentPost({
      variables: {
        comment: {
          body: message,
          postId,
          mentionIds: [],
          mediaUrl,
        },
      },
    });
    await refetch();
  };
  const replyToComment = async (
    commentId: string,
    message: string,
    mediaUrl?: string
  ) => {
    await commentPost({
      variables: {
        comment: {
          body: message,
          commentId,
          postId,
          mentionIds: [],
          mediaUrl,
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
              <CommentItem comment={comment} onReply={replyToComment} />
              {comment.comments.length > 0 && (
                <div className="ml-10 mt-4 pl-2">
                  {comment.comments.map((nestedComment) => (
                    <div key={nestedComment._id}>
                      <CommentItem comment={comment} />
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
