import { gql } from "@apollo/client";

export const VERIFY_INVITE = gql`
  query VerifyInvite($code: String!) {
    verifyInvite(code: $code)
  }
`;
