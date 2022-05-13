import { gql, useQuery, QueryResult } from "@apollo/client";
import { PostCategory } from "backend/graphql/posts.graphql";
import { User } from "backend/graphql/users.graphql";
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from "shared/graphql/fragments/post";
import { useEffect, useState } from "react";

type AccountPostsVariables = {
  categories?: PostCategory[];
};

export type Post = PostSummary;
export type AccountPostsData = {
  account?: Pick<User, "_id"> & {
    posts: Post[];
  };
};

/**
 * GraphQL query that fetches the account details for the current user
 *
 * @returns   GraphQL query.
 */
export function usePosts(
  categories?: PostCategory[],
): QueryResult<AccountPostsData, AccountPostsVariables> {
  const [state, setState] = useState<AccountPostsData>();
  const { data, loading, ...rest } = useQuery<AccountPostsData, AccountPostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query AccountPosts($categories: [PostCategory!]) {
        account {
          _id
          posts(categories: $categories) {
            ...PostSummaryFields
          }
        }
      }
    `,
    {
      variables: { ...(categories ? { categories } : {}) },
    },
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
