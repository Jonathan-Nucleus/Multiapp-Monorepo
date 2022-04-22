import { gql, QueryResult, useQuery } from "@apollo/client";
import { VIEW_POST_FRAGMENT } from "./post";
import { AccountData } from "./account";

type UserProfileData = {
  userProfile: AccountData["account"];
};

type UserProfileVariables = {
  userId: string;
};

export function useFetchProfile(
  userId: string,
): QueryResult<UserProfileData, UserProfileVariables> {
  return useQuery<UserProfileData, UserProfileVariables>(
    gql`
      ${VIEW_POST_FRAGMENT}
      query UserProfile($userId: ID!) {
        userProfile(userId: $userId) {
          _id
          firstName
          lastName
          avatar
          position
          tagline
          overview
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
          followers {
            _id
            firstName
            lastName
            avatar
            position
          }
          following {
            _id
            firstName
            lastName
            avatar
            position
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
          posts {
            ...ViewPostFields
          }
          linkedIn
          website
          twitter
        }
      }
    `,
    { variables: { userId } },
  );
}
