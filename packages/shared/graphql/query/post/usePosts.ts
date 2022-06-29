import { useState, useEffect, useRef } from "react";
import {
  gql,
  useQuery,
  QueryResult,
  FetchMoreQueryOptions,
  ApolloQueryResult,
  NetworkStatus,
} from "@apollo/client";
import _isEqual from "lodash/isEqual";
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
  const [queryCategories, setCategories] = useState(categories);
  const [queryRoleFilter, setRoleFilter] = useState(roleFilter);
  const isFetchMore = useRef(false);
  const lastNetworkStatus = useRef(0);
  const { data, loading, networkStatus, ...rest } = useQuery<
    PostsData,
    PostsVariables
  >(
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

  if (networkStatus < 7) {
    lastNetworkStatus.current = networkStatus;
  }

  if (
    !_isEqual(categories, queryCategories) ||
    roleFilter !== queryRoleFilter
  ) {
    setCategories(categories);
    setRoleFilter(roleFilter);
    setState(undefined);
  }

  useEffect(() => {
    if (networkStatus === NetworkStatus.ready) {
      const newPosts = data?.posts || [];
      const newData = { ...state };
      let existingPosts = newData.posts ? newData.posts : [];

      if (!rest.variables?.before) {
        const firstIndex = existingPosts.findIndex(
          (post) => post._id === newPosts[0]?._id
        );
        const lastIndex = existingPosts.findIndex(
          (post) => post._id === newPosts[newPosts.length - 1]?._id
        );

        // Splice out potentially deleted posts
        if (firstIndex !== lastIndex) {
          existingPosts.splice(0, lastIndex + 1).splice(0, 0, ...newPosts);
        }

        // Update remaining posts from local cache
        for (
          let index = Math.max(0, newPosts.length - 1);
          index < existingPosts.length;
          index++
        ) {
          const existingPost = existingPosts[index];
          const cachePost = rest.client.cache.readFragment({
            id: `Post:${existingPost._id}`,
            fragment: gql`
              ${POST_SUMMARY_FRAGMENT}
            `,
          }) as PostSummary | null;

          const { sharedPost } = existingPost;
          const cacheSharedPost = sharedPost
            ? (rest.client.cache.readFragment({
                id: `Post:${sharedPost._id}`,
                fragment: gql`
                  ${POST_SUMMARY_FRAGMENT}
                `,
              }) as PostSummary | null)
            : null;

          if (cachePost) {
            existingPosts[index] = {
              ...cachePost,
              sharedPost: cacheSharedPost ?? undefined,
            };
          }
        }
      } else {
        existingPosts = existingPosts.map((existingPost) => {
          const updatedPost = newPosts.find(
            (newPost) => newPost._id === existingPost._id
          );
          return updatedPost || existingPost;
        });
      }

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

      setState(newData);
    }
  }, [data, networkStatus]);

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

  return { data: state, loading, ...rest, fetchMore, networkStatus };
}
