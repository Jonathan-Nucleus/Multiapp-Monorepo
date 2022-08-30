import { useEffect, useState } from "react";
import _ from "lodash";
import { FundManager } from "../../fragments/fund";
import { User } from "backend/graphql/users.graphql";
import { gql, QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import { NotificationEventOptions } from "backend/schemas/user";

type AccountVariables = never;
export type WatchlistFund = FundManager &
  Pick<
    User["watchlist"][number],
    "_id" | "name" | "companyId" | "managerId"
  > & {
    company: Pick<
      User["watchlist"][number]["company"],
      "_id" | "name" | "website" | "linkedIn" | "twitter" | "avatar"
    >;
  };
export type AccountData = {
  account: Pick<
    User,
    | "_id"
    | "firstName"
    | "lastName"
    | "email"
    | "avatar"
    | "role"
    | "accreditation"
    | "position"
    | "tagline"
    | "overview"
    | "background"
    | "companyIds"
    | "followerCount"
    | "followerIds"
    | "followers"
    | "followingCount"
    | "followingIds"
    | "following"
    | "watchlistIds"
    | "companyFollowingIds"
    | "postIds"
    | "postCount"
    | "linkedIn"
    | "twitter"
    | "website"
    | "posts"
    | "managedFunds"
    | "mutedPostIds"
    | "settings"
    | "superUser"
  > & {
    watchlist: WatchlistFund[];
    company: Pick<
      User["companies"][number],
      | "_id"
      | "name"
      | "avatar"
      | "members"
      | "background"
      | "followerIds"
      | "postIds"
      | "followingIds"
    >;
    companies: Pick<
      User["companies"][number],
      | "_id"
      | "name"
      | "avatar"
      | "members"
      | "background"
      | "followerIds"
      | "postIds"
      | "followingIds"
    >[];
  };
};

/**
 * @deprecated - use useAccountContext instead
 *
 * GraphQL query that fetches the account details for the current user
 */
export function useAccount(
  options?: QueryHookOptions<AccountData, AccountVariables>
): QueryResult<AccountData, AccountVariables> {
  const [state, setState] = useState<AccountData>();
  const { data, loading, ...rest } = useQuery<AccountData, AccountVariables>(
    gql`
      query Account {
        account {
          _id
          superUser
          firstName
          lastName
          email
          avatar
          role
          accreditation
          position
          tagline
          overview
          postIds
          postCount
          website
          linkedIn
          twitter
          companyIds
          followerIds
          followingIds
          followerCount
          followingCount
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
            userType
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
    { ...options }
  );
  useEffect(() => {
    if (!loading && data && !_.isEqual(data, state)) {
      setState(data);
    }
  }, [data, loading, state]);
  return { data: state, loading, ...rest };
}
