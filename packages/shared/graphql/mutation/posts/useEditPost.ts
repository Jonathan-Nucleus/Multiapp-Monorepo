import { gql, useMutation, MutationTuple } from "@apollo/client";
import { POST_SUMMARY_FRAGMENT, PostSummary } from "../../fragments/post";
import { PostUpdate } from "backend/graphql/posts.graphql";

type EditPostVariables = {
  post: PostUpdate;
};

type EditPostData = {
  editPost?: PostSummary;
};

/**
 * GraphQL mutation that deletes a post
 *
 * @returns   GraphQL mutation.
 */
export function useEditPost(): MutationTuple<EditPostData, EditPostVariables> {
  return useMutation<EditPostData, EditPostVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      mutation EditPost($post: PostUpdate!) {
        editPost(post: $post) {
          ...PostSummaryFields
        }
      }
    `,
    {
      refetchQueries: ["Posts", "AccountPosts"],
    }
  );
}
