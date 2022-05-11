import { gql, useQuery, QueryHookOptions, QueryResult } from '@apollo/client';
import { User } from 'backend/graphql/users.graphql';
import { FundManager } from 'mobile/src/graphql/fragments/fund';
import { NotificationEventOptions } from 'backend/schemas/user';

type AccountVariables = never;
export type WatchlistFund = FundManager &
  Pick<
    User['watchlist'][number],
    '_id' | 'name' | 'companyId' | 'managerId'
  > & {
    company: Pick<
      User['watchlist'][number]['company'],
      '_id' | 'name' | 'website' | 'linkedIn' | 'twitter' | 'avatar'
    >;
  };
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
    | 'tagline'
    | 'overview'
    | 'background'
    | 'companyIds'
    | 'followerIds'
    | 'followers'
    | 'followingIds'
    | 'following'
    | 'watchlistIds'
    | 'companyFollowingIds'
    | 'postIds'
    | 'linkedIn'
    | 'twitter'
    | 'website'
    | 'posts'
    | 'managedFunds'
    | 'mutedPostIds'
    | 'settings'
  > & {
    watchlist: WatchlistFund[];
    company: Pick<
      User['companies'][number],
      | '_id'
      | 'name'
      | 'avatar'
      | 'members'
      | 'background'
      | 'followerIds'
      | 'postIds'
      | 'followingIds'
    >;
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
 *
 * @deprecated  See query/account/useAccount for alternative implementation.
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
          tagline
          overview
          postIds
          website
          linkedIn
          twitter
          companyIds
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
            manager {
              _id
              firstName
              lastName
              avatar
              followerIds
              postIds
              position
              role
            }
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
          mutedPostIds
          settings {
            interests
            tagging
            messaging
            emailUnreadMessage
            notifications {
              ${Object.keys(NotificationEventOptions)}
            }
          }
        }
      }
    `,
    { ...options },
  );
}
