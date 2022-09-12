import { gql, MutationTuple, useMutation } from "@apollo/client";

type DeleteCommentVariables = {
  commentId: string;
};

type DeleteCommentData = {
  deleteComment: boolean;
};

/**
 * GraphQL mutation that deletes users comments in admin panel.
 * @returns   GraphQL mutation.
 */
export function useDeleteComment(): MutationTuple<
  DeleteCommentData,
  DeleteCommentVariables
> {
  return useMutation<DeleteCommentData, DeleteCommentVariables>(
    gql`
      mutation DeleteComment($commentId: ID!) {
        deleteComment(commentId: $commentId)
      }
    `
  );
}
