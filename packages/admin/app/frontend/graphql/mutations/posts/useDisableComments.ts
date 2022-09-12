import { gql, MutationTuple, useMutation } from "@apollo/client";
import { Post } from "../../fragments/user";

type DisableCommentsVariables = {
  postId: string;
  disable: boolean;
};

type DisableCommentsData = {
  disableComments: Pick<Post, "_id" | "disableComments">;
};

/**
 * GraphQL mutation that deletes users comments in admin panel.
 * @returns   GraphQL mutation.
 */
export function useDisableComments(): MutationTuple<
  DisableCommentsData,
  DisableCommentsVariables
> {
  return useMutation<DisableCommentsData, DisableCommentsVariables>(
    gql`
      mutation DisableComments($postId: ID!, $disable: Boolean!) {
        disableComments(postId: $postId, disable: $disable) {
          _id
          disableComments
        }
      }
    `
  );
}
