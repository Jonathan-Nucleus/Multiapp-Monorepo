import { gql } from '@apollo/client';

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($settings: SettingsInput!) {
    updateSettings(settings: $settings)
  }
`;
