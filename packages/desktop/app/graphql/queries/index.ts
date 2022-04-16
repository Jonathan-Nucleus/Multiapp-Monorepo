import {
  gql,
  useMutation,
  useQuery,
  QueryHookOptions,
  QueryResult,
  MutationTuple,
} from "@apollo/client";

import { Post, PostCategory } from "backend/graphql/posts.graphql";
import { User } from "backend/graphql/users.graphql";

export const VERIFY_INVITE = gql`
  query VerifyInvite($code: String!) {
    verifyInvite(code: $code)
  }
`;

type FetchPostsVariables = {
  categories?: PostCategory[];
};

export type FetchPostsData = {
  posts?: (Pick<
    Post,
    | "_id"
    | "body"
    | "mediaUrl"
    | "likeIds"
    | "mentionIds"
    | "commentIds"
    | "createdAt"
    | "categories"
  > & {
    user: Pick<
      Post["user"],
      "_id" | "firstName" | "lastName" | "avatar" | "role" | "position"
    >;
  })[];
};

export const VIEW_POST_FRAGMENT = gql`
  fragment ViewPostFields on Post {
    _id
    body
    categories
    mediaUrl
    mentionIds
    likeIds
    commentIds
    createdAt
    user {
      _id
      firstName
      lastName
      avatar
      position
      role
    }
  }
`;

/**
 * GraphQL query that fetches posts for the current users home feed.
 *
 * @returns   GraphQL query.
 */
export function useFetchPosts(): QueryResult<
  FetchPostsData,
  FetchPostsVariables
> {
  return useQuery<FetchPostsData, FetchPostsVariables>(
    gql`
      ${VIEW_POST_FRAGMENT}
      query Posts($categories: [PostCategory!]) {
        posts(categories: $categories) {
          ...ViewPostFields
        }
      }
    `,
    { fetchPolicy: "cache-and-network" }
  );
}

type AccountVariables = never;
export type AccountData = {
  account: Pick<
    User,
    | "_id"
    | "firstName"
    | "lastName"
    | "avatar"
    | "role"
    | "accreditation"
    | "position"
    | "background"
    | "followerIds"
    | "postIds"
    | "followingIds"
  > & {
    companies: Pick<User["companies"][number], "_id" | "name" | "avatar">[];
  };
};

/**
 * GraphQL query that fetches the account details for the current user
 *
 * @returns   GraphQL query.
 */
export function useAccount(
  options?: QueryHookOptions<AccountData, AccountVariables>
): QueryResult<AccountData, AccountVariables> {
  return useQuery<AccountData, AccountVariables>(
    gql`
      query Account {
        account {
          _id
          firstName
          lastName
          avatar
          role
          accreditation
          position
          postIds
          followerIds
          followingIds
          background {
            url
            x
            y
            width
            height
            scale
          }
          companies {
            _id
            name
            avatar
            members {
              _id
              firstName
              lastName
              avatar
              company {
                name
              }
            }
            followerIds
            postIds
            followingIds
            background {
              url
              x
              y
              width
              height
              scale
            }
          }
        }
      }
    `,
    { fetchPolicy: "cache-first", ...options }
  );
}
