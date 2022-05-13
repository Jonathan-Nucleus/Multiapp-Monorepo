import { gql, MutationTuple, useMutation } from "@apollo/client";

type RequestResetVariables = {
  email: string;
};

type RequestResetData = {
  requestPasswordReset: boolean;
};

/**
 * GraphQL mutation that requests a reset of the user password.
 *
 * @returns   GraphQL mutation.
 */
export function useRequestPasswordReset(): MutationTuple<RequestResetData,
  RequestResetVariables> {
  return useMutation<RequestResetData, RequestResetVariables>(gql`
    mutation RequestPasswordReset($email: String!) {
      requestPasswordReset(email: $email)
    }
  `);
}