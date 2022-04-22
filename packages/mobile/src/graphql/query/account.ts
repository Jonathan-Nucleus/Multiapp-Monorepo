import {
  gql,
  useMutation,
  useQuery,
  QueryHookOptions,
  QueryResult,
  MutationTuple,
} from '@apollo/client';

import { Post, PostCategory } from 'backend/graphql/posts.graphql';
import { User } from 'backend/graphql/users.graphql';

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
    | '_id'
    | 'body'
    | 'mediaUrl'
    | 'likeIds'
    | 'mentionIds'
    | 'commentIds'
    | 'createdAt'
    | 'categories'
  > & {
    user: Pick<
      Post['user'],
      '_id' | 'firstName' | 'lastName' | 'avatar' | 'role' | 'position'
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
    { fetchPolicy: 'cache-and-network' },
  );
}

type AccountVariables = never;
export type AccountData = {
  account: Pick<
    User,
    | '_id'
    | 'firstName'
    | 'lastName'
    | 'avatar'
    | 'role'
    | 'accreditation'
    | 'position'
    | 'background'
    | 'followerIds'
    | 'followingIds'
    | 'companyFollowingIds'
    | 'postIds'
  > & {
    companies: Pick<
      User['companies'][number],
      | '_id'
      | 'name'
      | 'avatar'
      | 'members'
      | 'background'
      | 'followerIds'
      | 'postIds'
      | 'followingIds'
    >[];
  };
};

/**
 * GraphQL query that fetches the account details for the current user
 *
 * @returns   GraphQL query.
 */
export function useAccount(
  options?: QueryHookOptions<AccountData, AccountVariables>,
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
              website
              linkedIn
              twitter
            }
          }
          companyFollowingIds
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
            companyId
            managerId
            company {
              _id
              name
              website
              linkedIn
              twitter
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
                _id
                name
                website
                linkedIn
                twitter
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
    { ...options },
  );
}

type ChatTokenVariables = never;
export type ChatTokenData = {
  chatToken?: string;
};

/**
 * GraphQL query that fetchs an access token for messaging.
 *
 * @returns   GraphQL query.
 */
export function useChatToken(): QueryResult<ChatTokenData, ChatTokenVariables> {
  return useQuery<ChatTokenData, ChatTokenVariables>(
    gql`
      query ChatToken {
        chatToken
      }
    `,
  );
}

export type Invitee = Pick<User, 'avatar' | 'email' | 'firstName' | 'lastName'>;
type InvitesVariables = never;
export type InvitesData = {
  account: Pick<User, '_id'> & {
    invitees: Invitee[];
  };
};

/**
 * GraphQL query that fetches invitations sent by this user.
 *
 * @returns   GraphQL query.
 */
export function useInvites(
  options?: QueryHookOptions<InvitesData, InvitesVariables>,
): QueryResult<InvitesData, InvitesVariables> {
  return useQuery<InvitesData, InvitesVariables>(
    gql`
      query Invites {
        account {
          _id
          invitees {
            __typename
            ... on User {
              avatar
              email
              firstName
              lastName
            }
            ... on UserStub {
              email
            }
          }
        }
      }
    `,
    { ...options },
  );
}
