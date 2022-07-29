import { gql, useMutation, MutationTuple } from "@apollo/client";

type DeletePostVariables = {
  postId: string;
};

type DeletePostData = {
  deletePost: boolean;
};

/**
 * GraphQL mutation that deletes a post
 *
 * @returns   GraphQL mutation.
 */
export function useDeletePost(): MutationTuple<
  DeletePostData,
  DeletePostVariables
> {
  return useMutation<DeletePostData, DeletePostVariables>(
    gql`
      mutation DeletePost($postId: ID!) {
        deletePost(postId: $postId)
      }
    `,
    {
      refetchQueries: ["Posts", "Post", "AccountPosts", "Account"],
      update(cache, { data }, { variables }) {
        if (data?.deletePost && variables) {
          const normalizedId = cache.identify({
            id: variables.postId,
            __typename: "Post",
          });
          cache.evict({ id: normalizedId });
          cache.gc();
        }
      },
    }
  );
}
