import { gql } from "@apollo/client";

export const INVITE_USER = gql`
  mutation Invite($email: String!) {
    inviteUser(email: $email)
  }
`;
