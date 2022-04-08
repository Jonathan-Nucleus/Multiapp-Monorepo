import { gql } from '@apollo/client';

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($userId: String!, $settings: SettingsInput!) {
    updateSettings(userId: $userId, settings: $settings)
  }
`;
