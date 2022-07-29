import { useState, useEffect, useRef } from "react";
import {
  gql,
  useQuery,
  QueryResult,
  FetchMoreQueryOptions,
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
  const didUpdateState = useRef(false);
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
      skip: isFetchMore.current || didUpdateState.current,
      notifyOnNetworkStatusChange: true,
    }
  );

  // Reset flag once a single rerender after a state update has been initiated
  if (didUpdateState.current) {
    didUpdateState.current = false;
  }

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

    didUpdateState.current = true;
  }

  useEffect(() => {
    if (networkStatus === NetworkStatus.ready) {
      const existingPosts = [...(state?.posts ?? [])];
      const newPosts = data?.posts || [];

      const newIds = newPosts
        .filter((post) => !post.highlighted)
        .map((post) => post._id);
      const oldIds = existingPosts.map((post) => post._id);

      // Replace overlapping post entries with new data
      const intersection = newIds.filter((postId) => oldIds.includes(postId));
      if (intersection.length > 0) {
        const firstIndex = oldIds.indexOf(intersection[0]);
        const lastIndex = oldIds.indexOf(intersection[intersection.length - 1]);

        existingPosts.splice(
          firstIndex,
          lastIndex - firstIndex + 1,
          ...newPosts
        );
      } else {
        existingPosts.splice(0, 0, ...newPosts);
      }

      // Update remaining posts from local cache
      const updatedPosts = existingPosts.reduce((acc, post) => {
        if (intersection.includes(post._id)) {
          acc.push(post);
          return acc;
        }

        const cachePost = rest.client.cache.readFragment({
          id: `Post:${post._id}`,
          fragment: gql`
            ${POST_SUMMARY_FRAGMENT}
          `,
        }) as PostSummary | null;

        const { sharedPost } = post;
        const cacheSharedPost = sharedPost
          ? (rest.client.cache.readFragment({
              id: `Post:${sharedPost._id}`,
              fragment: gql`
                ${POST_SUMMARY_FRAGMENT}
              `,
            }) as PostSummary | null)
          : null;

        if (cachePost) {
          acc.push({
            ...cachePost,
            sharedPost: cacheSharedPost ?? undefined,
          });
        }

        return acc;
      }, [] as Post[]);

      setState({ posts: updatedPosts });
      didUpdateState.current = true;
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
      didUpdateState.current = true;
    }

    isFetchMore.current = false;
    return result as any; // TODO: Resolve type mismatch error
  };

  return { data: state, loading, ...rest, fetchMore, networkStatus };
}
