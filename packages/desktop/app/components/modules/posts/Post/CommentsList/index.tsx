import { Transition } from "@headlessui/react";
import { FC, useEffect, useState } from "react";
import { Comment, usePost } from "shared/graphql/query/post/usePost";
import SendMessage from "./SendMessage";
import CommentItem from "./CommentItem";
import { useAccount } from "shared/graphql/query/account/useAccount";
import { useCommentPost } from "shared/graphql/mutation/posts";
import Spinner from "../../../../common/Spinner";

interface CommentsListProps {
  show: boolean;
  postId: string;
}

const CommentsList: FC<CommentsListProps> = ({ show, postId }) => {
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
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
  const sendMessage = async (message: string, mediaUrl?: string) => {
    if ((!message || message.trim() === "") && !mediaUrl) return;
    try {
      await commentPost({
        variables: {
          comment: {
            body: message,
            postId,
            mentionIds: [],
            mediaUrl,
          },
        },
        refetchQueries: ["Posts"],
      });
      await refetch();
    } catch (err) {}
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
        <div className="px-4 relative">
          <SendMessage
            onSend={(val, mediaUrl) => sendMessage(val, mediaUrl)}
            placeholder="Add a comment..."
            user={account}
          />
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              key={comment._id}
              parentId={comment._id}
              postId={post._id}
            >
              {comment.comments.map((nestedComment) => (
                <CommentItem
                  comment={nestedComment}
                  key={nestedComment._id}
                  parentId={comment._id}
                  postId={post._id}
                />
              ))}
            </CommentItem>
          ))}
        </div>
      </Transition>
    </>
  );
};

export default CommentsList;
