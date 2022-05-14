import { gql, MutationTuple, useMutation } from "@apollo/client";
import { SettingsInput } from "backend/graphql/users.graphql";

type UpdateSettingsData = {
  updateSettings: boolean;
};

type UpdateSettingsVariables = {
  settings: SettingsInput;
};

export function useUpdateSettings(): MutationTuple<
  UpdateSettingsData,
  UpdateSettingsVariables
> {
  return useMutation<UpdateSettingsData, UpdateSettingsVariables>(
    gql`
      mutation UpdateSettings($settings: SettingsInput!) {
        updateSettings(settings: $settings)
      }
    `,
    {
      refetchQueries: ["Account"],
    }
  );
}
