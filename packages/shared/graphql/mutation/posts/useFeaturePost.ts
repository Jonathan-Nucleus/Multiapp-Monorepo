import { gql, useMutation, MutationTuple } from "@apollo/client";

type FeaturePostVariables = {
  postId: string;
  feature: boolean;
};

type FeaturePostData = {
  featurePost: {
    featured: boolean;
  };
};

/**
 * GraphQL mutation that pins/unpins a post
 *
 * @returns   GraphQL mutation.
 */
export function useFeaturePost(): MutationTuple<
  FeaturePostData,
  FeaturePostVariables
> {
  return useMutation<FeaturePostData, FeaturePostVariables>(
    gql`
      mutation FeaturePost($postId: ID!, $feature: Boolean!) {
        featurePost(postId: $postId, feature: $feature) {
          _id
          featured
        }
      }
    `,
    {
      refetchQueries: "all", // We use "all" for refetch until this bug is addressed https://github.com/apollographql/apollo-client/issues/9597
    }
  );
}
