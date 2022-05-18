import { gql, useMutation, MutationTuple } from "@apollo/client";
import { POST_SUMMARY_FRAGMENT, PostSummary } from "../../fragments/post";
import { SharePostInput } from "backend/graphql/posts.graphql";

type SharePostVariables = {
  postId: string;
  post: SharePostInput;
};

type SharePostData = {
  sharePost?: PostSummary;
};

/**
 * GraphQL mutation that deletes a post
 *
 * @returns   GraphQL mutation.
 */
export function useSharePost(): MutationTuple<
  SharePostData,
  SharePostVariables
> {
  return useMutation<SharePostData, SharePostVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      mutation SharePost($postId: ID!, $post: SharePostInput!) {
        sharePost(postId: $postId, post: $post) {
          ...PostSummaryFields
          sharedPost {
            ...PostSummaryFields
          }
        }
      }
    `,
    {
      refetchQueries: ["Posts", "AccountPosts"],
    }
  );
}
