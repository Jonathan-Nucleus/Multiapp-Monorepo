import { gql, QueryResult, useQuery } from "@apollo/client";
import { AccountData } from "../index";

type UserProfileData = {
  userProfile: AccountData["account"];
};

type UserProfileVariables = {
  userId: string;
};

export function useFetchProfile(
  userId: string
): QueryResult<UserProfileData, UserProfileVariables> {
  return useQuery<UserProfileData, UserProfileVariables>(
    gql`
      query UserProfile($userId: ID!) {
        userProfile(userId: $userId) {
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
          linkedIn
          website
          twitter
        }
      }
    `,
    { variables: { userId } }
  );
}
