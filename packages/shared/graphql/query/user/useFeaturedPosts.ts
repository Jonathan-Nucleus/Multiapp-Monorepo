import { gql, useQuery, QueryResult } from "@apollo/client";
import { User } from "backend/graphql/users.graphql";
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from "shared/graphql/fragments/post";
import { useEffect, useState } from "react";

type UserPostsVariables = {
  userId: string;
  featured: boolean;
};

export type Post = PostSummary;
export type UserPostsData = {
  userProfile?: Pick<User, "_id"> & {
    posts: Post[];
  };
};

/**
 * GraphQL query that fetches featured posts for the specified User.
 *
 * @param userId   The ID of the User.
 *
 * @returns   GraphQL query.
 */
export function useFeaturedPosts(
  userId: string
): QueryResult<UserPostsData, UserPostsVariables> {
  const [state, setState] = useState<UserPostsData>();
  const { data, loading, ...rest } = useQuery<
    UserPostsData,
    UserPostsVariables
  >(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query UserFeaturedPosts($userId: ID!, $featured: Boolean!) {
        userProfile(userId: $userId) {
          _id
          posts(featured: $featured) {
            ...PostSummaryFields
          }
        }
      }
    `,
    {
      variables: {
        userId,
        featured: true,
      },
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
