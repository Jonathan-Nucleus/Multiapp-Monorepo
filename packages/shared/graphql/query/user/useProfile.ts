import { gql, QueryResult, useQuery } from "@apollo/client";
import { User } from "backend/graphql/users.graphql";
import { useEffect, useState } from "react";

export type WatchlistFund = Pick<
  User["watchlist"][number],
  "_id" | "name" | "companyId" | "managerId"
> & {
  company: Pick<
    User["watchlist"][number]["company"],
    "_id" | "name" | "website" | "linkedIn" | "twitter" | "avatar"
  >;
};
export type UserProfile = Pick<
  User,
  | "_id"
  | "firstName"
  | "lastName"
  | "avatar"
  | "role"
  | "position"
  | "tagline"
  | "overview"
  | "background"
  | "followerIds"
  | "followers"
  | "followingIds"
  | "following"
  | "watchlistIds"
  | "postIds"
  | "linkedIn"
  | "twitter"
  | "website"
  | "managedFunds"
  | "accreditation"
  | "mutedPostIds"
> & {
  watchlist: WatchlistFund[];
  company?: Pick<
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

type UserProfileVariables = {
  userId: string;
};

type UserProfileData = {
  userProfile?: UserProfile;
};

// TODO: Update to move followers and following to a separate query and just
// fetch followerIds and followingIds here
export function useProfile(
  userId?: string
): QueryResult<UserProfileData, UserProfileVariables> {
  const [state, setState] = useState<UserProfileData>();
  const { data, loading, ...rest } = useQuery<
    UserProfileData,
    UserProfileVariables
  >(
    gql`
      query UserProfile($userId: ID!) {
        userProfile(userId: $userId) {
          _id
          firstName
          lastName
          avatar
          position
          role
          tagline
          overview
          followerIds
          followingIds
          postIds
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
          company {
            _id
            name
            avatar
            background {
              url
              x
              y
              width
              height
              scale
            }
          }
          companies {
            _id
            name
            avatar
            followerIds
          }
          managedFunds {
            _id
            name
            level
            status
            highlights
            overview
            tags
            manager {
              _id
              firstName
              lastName
              avatar
              followerIds
              postIds
            }
            company {
              _id
              name
              avatar
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
          linkedIn
          website
          twitter
        }
      }
    `,
    {
      skip: !userId,
      variables: { userId: userId ?? "" },
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
