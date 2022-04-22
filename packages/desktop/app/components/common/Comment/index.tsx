import { FC, useMemo } from "react";
import { useCommentPost } from "desktop/app/graphql/mutations/posts";
import type { Comment } from "backend/graphql/comments.graphql";
import SendMessage from "./SendMessage";
import CommentsList from "./CommentsList";
import Card from "../Card";
import { PostType } from "desktop/app/types/common-props";

interface CommentPostProps {
  post: PostType;
}

const CommentPost: FC<CommentPostProps> = ({ post }: CommentPostProps) => {
  const [commentPost] = useCommentPost();

  const sendMessage = async (
    message: string,
    mediaUrl?: string
  ): Promise<void> => {
    if (!message || message === "") return;
    try {
      await commentPost({
        variables: {
          comment: {
            body: message,
            postId: post._id,
            mentionIds: [], // Update to add mentions
          },
        },
        refetchQueries: ["Posts"],
      });
    } catch (err) {
    }
  };

  const commentsByCommentID: Record<string, Comment[]> = useMemo(() => {
    const temp: Record<string, Comment[]> = {};
    post.comments.forEach((comment) => {
      if (comment.commentId) {
        if (!temp[comment.commentId]) {
          temp[comment.commentId] = [];
        }
        temp[comment.commentId].push(comment);
      }
    });
    return temp;
  }, [post.comments]);

  return (
    <Card className="border-0 p-0 px-4 rounded-none relative">
      <SendMessage
        size={36}
        onSend={(val, mediaUrl) => sendMessage(val, mediaUrl)}
        placeholder="Add a comment..."
      />
      <CommentsList
        comments={post.comments}
        commentsByCommentID={commentsByCommentID}
        parentId={null}
        postId={post._id}
      />
    </Card>
  );
};

export default CommentPost;
