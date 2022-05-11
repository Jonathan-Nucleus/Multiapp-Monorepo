import { FC, useMemo } from "react";
import SendMessage from "./SendMessage";
import CommentCard from "./CommentCard";
import Card from "../Card";

import { useCommentPost } from "mobile/src/graphql/mutation/posts";
import { Comment, usePost } from "mobile/src/graphql/query/post";
import { useAccount } from "mobile/src/graphql/query/account";

interface CommentPostProps {
  postId: string;
}

const CommentPost: FC<CommentPostProps> = ({ postId }) => {
  const { data: postData, refetch } = usePost(postId);
  const { data: accountData } = useAccount({ fetchPolicy: "cache-only" });
  const [commentPost] = useCommentPost();

  const account = accountData?.account;
  const post = postData?.post;
  const allComments = post?.comments ?? [];

  const commentsById = useMemo(() => {
    const commentMap: Record<string, Comment[]> = {};
    allComments.forEach((comment) => {
      if (comment.commentId) {
        if (!commentMap[comment.commentId]) {
          commentMap[comment.commentId] = [];
        }

        commentMap[comment.commentId].push(comment);
      }
    });

    return commentMap;
  }, [allComments]);

  const comments = useMemo(() => {
    return allComments?.filter((comment) => !comment.commentId) || [];
  }, [allComments]);

  if (!post) return <></>;

  const sendMessage = async (
    message: string,
    mediaUrl?: string
  ): Promise<void> => {
    if ((!message || message.trim() === "") && !mediaUrl) return;
    try {
      await commentPost({
        variables: {
          comment: {
            body: message,
            postId: post._id,
            mentionIds: [], // TODO: Update to add mentions
            mediaUrl,
          },
        },
        refetchQueries: ["Posts"],
      });
      refetch();
    } catch (err) {}
  };

  return (
    <div className="px-4 relative">
      <SendMessage
        onSend={(val, mediaUrl) => sendMessage(val, mediaUrl)}
        placeholder="Add a comment..."
        user={account}
      />
      {comments.map((comment) => (
        <CommentCard
          comment={comment}
          key={comment._id}
          parentId={comment._id}
          postId={post._id}
        >
          {commentsById[comment._id]?.map((nestedComment) => (
            <CommentCard
              comment={nestedComment}
              key={nestedComment._id}
              parentId={comment._id}
              postId={post._id}
            />
          ))}
        </CommentCard>
      ))}
    </div>
  );
};

export default CommentPost;
