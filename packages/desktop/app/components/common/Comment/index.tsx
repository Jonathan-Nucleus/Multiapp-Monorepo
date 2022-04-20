import { FC, useMemo } from "react";

import { FetchPostsData } from "desktop/app/graphql/queries";
import { useCommentPost } from "desktop/app/graphql/mutations/posts";
import type { Comment } from "backend/graphql/comments.graphql";
import SendMessage from "./SendMessage";
import CommentsList from "./CommentsList";
import Card from "../Card";

type Post = Exclude<FetchPostsData["posts"], undefined>[number];

interface CommentPostProps {
  post: Post;
}

const CommentPost: FC<CommentPostProps> = ({ post }: CommentPostProps) => {
  const [commentPost] = useCommentPost();

  const sendMessage = async (
    messsage: string,
    mediaUrl?: string
  ): Promise<void> => {
    if (!messsage || messsage === "") return;
    console.log("mediaUrl", mediaUrl);
    try {
      await commentPost({
        variables: {
          comment: {
            body: messsage,
            postId: post._id,
            mentionIds: [], // Update to add mentions
          },
        },
        refetchQueries: ["Posts"],
      });
    } catch (err) {
      console.log("send mesage error", err);
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
