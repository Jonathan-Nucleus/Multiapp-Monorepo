import { gql, useMutation, MutationTuple } from '@apollo/client';

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
  return useMutation<WatchFundData, WatchFundVariables>(gql`
    mutation WatchFund($watch: Boolean!, $fundId: ID!) {
      watchFund(watch: $watch, fundId: $fundId)
    }
  `);
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
  return useMutation<FollowUserData, FollowUserVariables>(gql`
    mutation FollowUser($follow: Boolean!, $userId: ID!) {
      followUser(follow: $follow, userId: $userId)
    }
  `);
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
