import { gql, useQuery, QueryHookOptions, QueryResult } from "@apollo/client";

import { Post, PostCategory } from "backend/graphql/posts.graphql";
import { User } from "backend/graphql/users.graphql";
import { Company } from "backend/graphql/companies.graphql";

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
    | "likes"
    | "shareIds"
    | "comments"
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
    shareIds
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
    likes {
      _id
      firstName
      lastName
      avatar
      position
      role
      company {
        _id
        name
        avatar
      }
    }
    comments {
      _id
      body
      createdAt
      likeIds
      commentId
      mentions {
        _id
        firstName
        lastName
        avatar
        role
        position
      }
      user {
        _id
        firstName
        lastName
        avatar
        role
        position
      }
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

export type FollowUser = Pick<
  User,
  "_id" | "firstName" | "lastName" | "avatar" | "position"
> & {
  company: Pick<Company, "_id" | "name">;
};
export type WatchedFund = Pick<
  User["watchlist"][number],
  "_id" | "name" | "avatar" | "companyId" | "managerId"
> & {
  company: Pick<User["watchlist"][number]["company"], "name" | "avatar">;
};

type AccountVariables = never;

export type AccountData = {
  account?: Pick<
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
    | "company"
    | "companies"
    | "followingIds"
    | "watchlistIds"
    | "twitter"
    | "linkedIn"
    | "website"
    | "tagline"
    | "overview"
    | "followers"
    | "following"
  > & {
    watchlist: WatchedFund[];
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
          website
          linkedIn
          twitter
          followerIds
          followingIds
          following {
            _id
            firstName
            lastName
            avatar
            position
            company {
              _id
              name
            }
          }
          followers {
            _id
            firstName
            lastName
            avatar
            position
            company {
              _id
              name
            }
          }
          background {
            url
            x
            y
            width
            height
            scale
          }
          watchlist {
            _id
            name
            avatar
            companyId
            managerId
            company {
              name
              avatar
            }
          }
          watchlistIds
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
            following {
              _id
              firstName
              lastName
              avatar
              position
            }
            followers {
              _id
              firstName
              lastName
              avatar
              position
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
