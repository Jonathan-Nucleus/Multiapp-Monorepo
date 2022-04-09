import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const LOGIN_OAUTH = gql`
  mutation LoginOAuth($user: OAuthUserInput!) {
    loginOAuth(user: $user)
  }
`;

export const REGISTER = gql`
  mutation Register($user: UserInput!) {
    register(user: $user)
  }
`;

export const REQUEST_INVITE = gql`
  mutation RequestInvite($email: String!) {
    requestInvite(email: $email)
  }
`;

export const REQUEST_RESET_PASSWORD = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        _id
        role
        accreditation
      }
      token
    }
  }
`;
