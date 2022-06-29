import { gql, MutationTuple, useMutation } from "@apollo/client";

type UpdatePasswordData = {
  updatePassword?: string;
};

type UpdatePasswordVariables = {
  oldPassword: string;
  newPassword: string;
};

export function useUpdatePassword(): MutationTuple<
  UpdatePasswordData,
  UpdatePasswordVariables
> {
  return useMutation<UpdatePasswordData, UpdatePasswordVariables>(
    gql`
      mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
        updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
      }
    `,
    {
      refetchQueries: ["Account"],
    }
  );
}
