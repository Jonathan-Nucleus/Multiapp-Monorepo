import {
  gql,
  useMutation,
  useLazyQuery,
  QueryTuple,
  MutationTuple,
} from "@apollo/client";
import { ssrQuery, SSRQueryResult } from "desktop/app/lib/apolloClient";
import { User } from "backend/schemas/user";

type VerifyInviteVariables = {
  code: string;
};

type VerifyInviteData = {
  verifyInvite: string;
};

const VERIFY_INVITE_QUERY = gql`
  query VerifyInvite($code: String!) {
    verifyInvite(code: $code)
  }
`;

/**
 * GraphQL lazy query that verifies a user invite code that unlocks
 * registration.
 *
 * @returns   GraphQL query.
 */
export function useVerifyInvite(): QueryTuple<
  VerifyInviteData,
  VerifyInviteVariables
> {
  return useLazyQuery<VerifyInviteData, VerifyInviteVariables>(
    VERIFY_INVITE_QUERY
  );
}

/**
 * Performs server-side query to verify that the user invite code that unlocks
 * registration is valid.
 *
 * @returns   GraphQL query.
 */
export function getVerifyInvite(
  code: string
): Promise<SSRQueryResult<VerifyInviteData>> {
  return ssrQuery<VerifyInviteData, VerifyInviteVariables>(
    {
      query: VERIFY_INVITE_QUERY,
      variables: { code },
    },
    ""
  );
}

type RegisterVariables = {
  user: User.Input;
};

type RegisterData = {
  register: string | null;
};

/**
 * GraphQL mutation that registers a new user.
 *
 * @returns   GraphQL mutation.
 */
export function useRegisterUser(): MutationTuple<
  RegisterData,
  RegisterVariables
> {
  return useMutation<RegisterData, RegisterVariables>(gql`
    mutation Register($user: UserInput!) {
      register(user: $user)
    }
  `);
}

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
export function useRequestReset(): MutationTuple<
  RequestResetData,
  RequestResetVariables
> {
  return useMutation<RequestResetData, RequestResetVariables>(gql`
    mutation RequestPasswordReset($email: String!) {
      requestPasswordReset(email: $email)
    }
  `);
}

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
export function useResetPassword(): MutationTuple<
  ResetPasswordData,
  ResetPasswordVariables
> {
  return useMutation<ResetPasswordData, ResetPasswordVariables>(gql`
    mutation ResetPassword($password: String!, $token: String!) {
      resetPassword(password: $password, token: $token)
    }
  `);
}
