import { gql, MutationTuple, useMutation } from "@apollo/client";

type DeletePostVariables = {
  postId: string;
};

type DeletePostData = {
  deletePost: boolean;
};

/**
 * GraphQL mutation that deletes users posts in admin panel.
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
