import React, { FC } from "react";

import CommentCard from "./CommentCard";
import type { Comment } from "backend/graphql/comments.graphql";

interface CommentDetailProps {
  comments: Comment[] | undefined;
  postId: string;
  parentId: string | null;
  commentsByCommentID?: Record<string, Comment[]> | undefined;
}

const CommentsList: FC<CommentDetailProps> = ({
  comments,
  commentsByCommentID,
  parentId,
  postId,
}) => {
  if (!comments?.length) {
    return null;
  }

  return (
    <>
      {comments.map((comment) =>
        comment.commentId === parentId ? (
          <div key={comment._id}>
            <CommentCard comment={comment} postId={postId}>
              <CommentsList
                comments={commentsByCommentID[comment._id]}
                commentsByCommentID={commentsByCommentID}
                parentId={comment._id}
                postId={postId}
              />
            </CommentCard>
          </div>
        ) : null
      )}
    </>
  );
};
export default CommentsList;
