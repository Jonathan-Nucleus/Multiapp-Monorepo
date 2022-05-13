import { gql, MutationTuple, useMutation } from "@apollo/client";

type ResetPasswordVariables = {
  password: string;
  token: string;
};

type ResetPasswordData = {
  resetPassword: boolean;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useResetPassword(): MutationTuple<ResetPasswordData,
  ResetPasswordVariables> {
  return useMutation<ResetPasswordData, ResetPasswordVariables>(gql`
    mutation ResetPassword($password: String!, $token: String!) {
      resetPassword(password: $password, token: $token)
    }
  `);
}