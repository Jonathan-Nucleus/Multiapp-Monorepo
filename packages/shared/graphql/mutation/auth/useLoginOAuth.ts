import { gql, useMutation, MutationTuple } from "@apollo/client";
import { OAuthInput } from "backend/graphql/users.graphql";

type LoginOAuthVariables = {
  user: OAuthInput;
};

type LoginOAuthData = {
  loginOAuth: string | null;
};

export function useLoginOAuth(): MutationTuple<
  LoginOAuthData,
  LoginOAuthVariables
> {
  return useMutation<LoginOAuthData, LoginOAuthVariables>(gql`
    mutation LoginOAuth($user: OAuthUserInput!) {
      loginOAuth(user: $user)
    }
  `);
}
