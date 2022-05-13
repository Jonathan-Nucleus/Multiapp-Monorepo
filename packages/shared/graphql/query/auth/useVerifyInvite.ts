import { gql, QueryResult, QueryTuple, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

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
export function useVerifyInviteLazy(): QueryTuple<VerifyInviteData,
  VerifyInviteVariables> {
  return useLazyQuery<VerifyInviteData, VerifyInviteVariables>(
    VERIFY_INVITE_QUERY,
  );
}

export function useVerifyInvite(
  code: string,
): QueryResult<VerifyInviteData, VerifyInviteVariables> {
  const [state, setState] = useState<VerifyInviteData>();
  const { data, loading, ...rest } = useQuery<VerifyInviteData,
    VerifyInviteVariables>(VERIFY_INVITE_QUERY, { variables: { code } });
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
