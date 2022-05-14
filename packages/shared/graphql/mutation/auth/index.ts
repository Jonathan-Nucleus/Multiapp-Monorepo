import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const REGISTER = gql`
  mutation Register($user: UserInput!) {
    register(user: $user)
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!, $password: String!, $token: String!) {
    resetPassword(email: $email, password: $password, token: $password)
  }
`;
