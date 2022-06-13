import { useState, useEffect, useRef } from "react";
import {
  gql,
  useQuery,
  QueryResult,
  FetchMoreQueryOptions,
  ApolloQueryResult,
  NetworkStatus,
} from "@apollo/client";
import {
  PostCategory,
  Audience,
  PostRoleFilter,
} from "backend/graphql/posts.graphql";
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from "shared/graphql/fragments/post";

export type { Audience, PostCategory, PostRoleFilter };

export type Post = PostSummary & {
  sharedPost?: PostSummary;
};
export type PostsData = {
  posts?: Post[];
};
type PostsVariables = {
  categories?: PostCategory[];
  roleFilter?: PostRoleFilter;
  before?: string;
  limit?: number;
};

/**
 * GraphQL query that fetches posts for the current users home feed.
 *
 * @returns   GraphQL query.
 */
export function usePosts(
  categories?: PostCategory[],
  roleFilter?: PostRoleFilter,
  before?: string,
  limit = 10
): QueryResult<PostsData, PostsVariables> {
  const [state, setState] = useState<PostsData>();
  const isFetchMore = useRef(false);
  const lastNetworkStatus = useRef(0);
  const { data, loading, ...rest } = useQuery<PostsData, PostsVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query Posts(
        $categories: [PostCategory!]
        $roleFilter: PostRoleFilter
        $before: ID
        $limit: Int
      ) {
        posts(
          categories: $categories
          roleFilter: $roleFilter
          before: $before
          limit: $limit
        ) {
          ...PostSummaryFields
          sharedPost {
            ...PostSummaryFields
          }
        }
      }
    `,
    {
      variables: {
        ...(categories ? { categories } : {}),
        ...(roleFilter ? { roleFilter } : {}),
        before,
        limit,
      },
      fetchPolicy: "cache-and-network",
      skip: isFetchMore.current,
      notifyOnNetworkStatusChange: true,
    }
  );

  if (rest.networkStatus < 7) {
    lastNetworkStatus.current = rest.networkStatus;
  }

  useEffect(() => {
    if (rest.networkStatus === NetworkStatus.ready) {
      const newPosts = data?.posts || [];
      if (lastNetworkStatus.current === NetworkStatus.loading && state) {
        const newData = { ...state };
        const existingPosts = newData.posts ? newData.posts : [];
        newData.posts = [
          ...existingPosts,
          ...newPosts.filter(
            (post) =>
              !existingPosts.some(
                (existingPost) =>
                  existingPost._id.toString() === post._id.toString()
              )
          ),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (existingPosts.length !== newData.posts?.length) {
          setState(newData);
        }
      } else if (
        !state ||
        lastNetworkStatus.current === NetworkStatus.setVariables ||
        lastNetworkStatus.current === NetworkStatus.refetch
      ) {
        setState(data);
      }
    }
  }, [data, loading]);

  const fetchMore: typeof rest.fetchMore = async (
    params: FetchMoreQueryOptions<PostsVariables>
  ) => {
    if (isFetchMore.current) return;

    isFetchMore.current = true;
    const result = await rest.fetchMore({
      ...params,
      variables: {
        ...(categories ? { categories } : {}),
        ...(roleFilter ? { roleFilter } : {}),
        limit,
        ...params.variables,
      },
    });

    if (result.data.posts) {
      console.log("Fetched", result.data.posts.length, "more posts");
      const newData = { ...state };
      newData.posts = [
        ...(newData.posts ? newData.posts : []),
        ...result.data.posts,
      ];
      setState(newData);
    }

    isFetchMore.current = false;
    return result as any; // TODO: Resolve type mismatch error
  };

  return { data: state, loading, ...rest, fetchMore };
}
