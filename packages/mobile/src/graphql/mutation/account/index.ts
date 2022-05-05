import { gql, useMutation, MutationTuple } from '@apollo/client';
import { UserProfile } from 'backend/graphql/users.graphql';
import { Company } from 'backend/graphql/companies.graphql';

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($settings: SettingsInput!) {
    updateSettings(settings: $settings)
  }
`;

export const INVITE_USER = gql`
  mutation Invite($email: String!) {
    inviteUser(email: $email)
  }
`;

type WatchFundVariables = {
  fundId: string;
  watch: boolean;
};

type WatchFundData = {
  watchFund: boolean;
};

export function useWatchFund(): MutationTuple<
  WatchFundData,
  WatchFundVariables
> {
  return useMutation<WatchFundData, WatchFundVariables>(
    gql`
      mutation WatchFund($watch: Boolean!, $fundId: ID!) {
        watchFund(watch: $watch, fundId: $fundId)
      }
    `,
    {
      refetchQueries: ['Funds'],
    },
  );
}

type FollowUserVariables = {
  follow: boolean;
  userId: string;
};

type FollowUserData = {
  followUser: boolean;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useFollowUser(): MutationTuple<
  FollowUserData,
  FollowUserVariables
> {
  return useMutation<FollowUserData, FollowUserVariables>(
    gql`
      mutation FollowUser($follow: Boolean!, $userId: ID!) {
        followUser(follow: $follow, userId: $userId)
      }
    `,
    {
      refetchQueries: ['Account'],
    },
  );
}

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
  return useMutation<HideUserData, HideUserVariables>(gql`
    mutation HideUser($hide: Boolean!, $userId: ID!) {
      hideUser(hide: $hide, userId: $userId)
    }
  `);
}

type SaveQuestionnaireVariables = {
  questionnaire: {
    class: string;
    status: string;
    level: string;
    date: Date;
  };
};

type SaveQuestionnaireData = {
  saveQuestionnaire: {
    _id: string;
  };
};

/**
 * GraphQL mutation that saves questionnarie
 *
 * @returns   GraphQL mutation.
 */
export function useSaveQuestionnaire(): MutationTuple<
  SaveQuestionnaireData,
  SaveQuestionnaireVariables
> {
  return useMutation<SaveQuestionnaireData, SaveQuestionnaireVariables>(gql`
    mutation SaveQuestionnaire($questionnaire: QuestionnaireInput!) {
      saveQuestionnaire(questionnaire: $questionnaire) {
        _id
      }
    }
  `);
}

type FollowCompanyVariables = {
  companyId: string;
  follow: boolean;
};

type FollowCompanyData = {
  followCompany: boolean;
};

/**
 *
 * @returns   GraphQL mutation.
 */
export function useFollowCompany(): MutationTuple<
  FollowCompanyData,
  FollowCompanyVariables
> {
  return useMutation<FollowCompanyData, FollowCompanyVariables>(gql`
    mutation FollowCompany($follow: Boolean!, $companyId: ID!) {
      followCompany(follow: $follow, companyId: $companyId)
    }
  `);
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
  | '_id'
  | 'firstName'
  | 'lastName'
  | 'position'
  | 'avatar'
  | 'background'
  | 'tagline'
  | 'overview'
  | 'website'
  | 'twitter'
  | 'linkedIn'
>;
type UpdateUserProfileVariables = {
  profile: Pick<ProfileData, '_id'> & Partial<ProfileData>;
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
  return useMutation<UpdateUserProfileData, UpdateUserProfileVariables>(gql`
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
  `);
}

type CompanyData = Pick<
  Company,
  | '_id'
  | 'name'
  | 'avatar'
  | 'background'
  | 'tagline'
  | 'overview'
  | 'website'
  | 'twitter'
  | 'linkedIn'
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
  return useMutation<
    UpdateCompanyProfileData,
    UpdateCompanyProfileVariables
  >(gql`
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
  `);
}

type ProRequestVariables = {
  request: {
    role: string;
    email: string;
    organization: string;
    position: string;
    info: string;
  };
};

type ProRequestData = {
  proRequest: boolean;
};

/**
 *
 * @returns   GraphQL mutation.
 */
export function useProRequest(): MutationTuple<
  ProRequestData,
  ProRequestVariables
> {
  return useMutation<ProRequestData, ProRequestVariables>(gql`
    mutation ProRequest($request: ProRequestInput!) {
      proRequest(request: $request)
    }
  `);
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
