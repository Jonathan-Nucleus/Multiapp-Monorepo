import { gql, MutationTuple, useMutation } from "@apollo/client";

type ProRequestVariables = {
  request: {
    role: string;
    email: string;
    organization: string;
    position: string;
    info: string;
  };
};

type ProRequestData = {
  proRequest: boolean;
};

/**
 *
 * @returns   GraphQL mutation.
 */
export function useProRequest(): MutationTuple<ProRequestData,
  ProRequestVariables> {
  return useMutation<ProRequestData, ProRequestVariables>(gql`
    mutation ProRequest($request: ProRequestInput!) {
      proRequest(request: $request)
    }
  `);
}
