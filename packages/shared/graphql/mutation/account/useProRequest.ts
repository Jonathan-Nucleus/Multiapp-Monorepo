import { gql, MutationTuple, useMutation } from "@apollo/client";

export type ProRequest = {
  role: string;
  email: string;
  organization: string;
  position: string;
  info: string;
};

type ProRequestVariables = {
  request: ProRequest;
};

type ProRequestData = {
  proRequest: boolean;
};

/**
 *
 * @returns   GraphQL mutation.
 */
export function useProRequest(): MutationTuple<
  ProRequestData,
  ProRequestVariables
> {
  return useMutation<ProRequestData, ProRequestVariables>(gql`
    mutation ProRequest($request: ProRequestInput!) {
      proRequest(request: $request)
    }
  `);
}
