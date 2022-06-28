import { gql, useMutation, MutationTuple } from "@apollo/client";
import { UserProfile } from "backend/graphql/users.graphql";
import { Company } from "backend/graphql/companies.graphql";

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($settings: SettingsInput!) {
    updateSettings(settings: $settings)
  }
`;

type HideUserVariables = {
  hide: boolean;
  userId: string;
};

type HideUserData = {
  hideUser: boolean;
};

/**
 * GraphQL mutation that hides user
 *
 * @returns   GraphQL mutation.
 */
export function useHideUser(): MutationTuple<HideUserData, HideUserVariables> {
  return useMutation<HideUserData, HideUserVariables>(
    gql`
      mutation HideUser($hide: Boolean!, $userId: ID!) {
        hideUser(hide: $hide, userId: $userId)
      }
    `,
    {
      refetchQueries: ["Posts", "Post"],
    }
  );
}

type FollowUserAsCompanyVariables = {
  follow: boolean;
  userId: string;
  asCompanyId: string;
};

type FollowUserAsCompanyData = {
  followUser: boolean;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useFollowUserAsCompany(): MutationTuple<
  FollowUserAsCompanyData,
  FollowUserAsCompanyVariables
> {
  return useMutation<FollowUserAsCompanyData, FollowUserAsCompanyVariables>(gql`
    mutation FollowUserAsCompany(
      $follow: Boolean!
      $userId: ID!
      $asCompanyId: ID!
    ) {
      followUser(follow: $follow, userId: $userId, asCompanyId: $asCompanyId)
    }
  `);
}

type ProfileData = Pick<
  UserProfile,
  | "_id"
  | "firstName"
  | "lastName"
  | "position"
  | "avatar"
  | "background"
  | "tagline"
  | "overview"
  | "website"
  | "twitter"
  | "linkedIn"
>;
type UpdateUserProfileVariables = {
  profile: Pick<ProfileData, "_id"> & Partial<ProfileData>;
};

type UpdateUserProfileData = {
  updateUserProfile: ProfileData;
};

/**
 * GraphQL mutation that update user profile
 *
 * @returns   GraphQL mutation.
 */
export function useUpdateUserProfile(): MutationTuple<
  UpdateUserProfileData,
  UpdateUserProfileVariables
> {
  return useMutation<UpdateUserProfileData, UpdateUserProfileVariables>(
    gql`
      mutation UpdateUserProfile($profile: UserProfileInput!) {
        updateUserProfile(profile: $profile) {
          _id
          firstName
          lastName
          position
          avatar
          background {
            url
            x
            y
            width
            height
            scale
          }
          tagline
          overview
          website
          linkedIn
          twitter
        }
      }
    `,
    {
      refetchQueries: ["Account"],
    }
  );
}

type CompanyData = Pick<
  Company,
  | "_id"
  | "name"
  | "avatar"
  | "background"
  | "tagline"
  | "overview"
  | "website"
  | "twitter"
  | "linkedIn"
>;
type UpdateCompanyProfileVariables = {
  profile: CompanyData;
};

type UpdateCompanyProfileData = {
  updateCompanyProfile: CompanyData;
};

/**
 * GraphQL mutation that update user profile
 *
 * @returns   GraphQL mutation.
 */
export function useUpdateCompanyProfile(): MutationTuple<
  UpdateCompanyProfileData,
  UpdateCompanyProfileVariables
> {
  return useMutation<UpdateCompanyProfileData, UpdateCompanyProfileVariables>(
    gql`
      mutation UpdateCompanyProfile($profile: CompanyProfileInput!) {
        updateCompanyProfile(profile: $profile) {
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
          tagline
          overview
          website
          linkedIn
          twitter
        }
      }
    `,
    {
      refetchQueries: ["CompanyProfile"],
    }
  );
}

type UpdateFcmTokenVariables = {
  fcmToken: string;
};

type UpdateFcmTokenData = {
  updateFcmToken: boolean;
};

/**
 * GraphQL mutation that save fcm token
 *
 * @returns   GraphQL mutation.
 */
export function useUpdateFcmToken(): MutationTuple<
  UpdateFcmTokenData,
  UpdateFcmTokenVariables
> {
  return useMutation<UpdateFcmTokenData, UpdateFcmTokenVariables>(gql`
    mutation UpdateFcmToken($fcmToken: String!) {
      updateFcmToken(fcmToken: $fcmToken)
    }
  `);
}

type DeleteAccountVariables = never;
type DeleteAccountData = {
  deleteAccount: boolean;
};

/**
 * GraphQL mutation that deletes the user account.
 *
 * @returns   GraphQL mutation.
 */
export function useDeleteAccount(): MutationTuple<
  DeleteAccountData,
  DeleteAccountVariables
> {
  return useMutation<DeleteAccountData, DeleteAccountVariables>(gql`
    mutation DeleteAccount {
      deleteAccount
    }
  `);
}

export type HelpRequest = {
  type: string;
  email?: string;
  phone?: string;
  fundId: string;
  message: string;
  preferredTimeOfDay?: string;
};

type HelpRequestVariables = {
  request: HelpRequest;
};

type HelpRequestData = {
  helpRequest: boolean;
};

/**
 *
 * @returns   GraphQL mutation.
 */
export function useHelpRequest(): MutationTuple<
  HelpRequestData,
  HelpRequestVariables
> {
  return useMutation<HelpRequestData, HelpRequestVariables>(gql`
    mutation HelpRequest($request: HelpRequestInput!) {
      helpRequest(request: $request)
    }
  `);
}
