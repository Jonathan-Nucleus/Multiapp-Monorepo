import { gql, QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { User } from "backend/graphql/users.graphql";

export type Invitee = Pick<User, "avatar" | "email" | "firstName" | "lastName">;
export type InvitesVariables = never;
export type InviteesData = {
  account: Pick<User, "_id" | "role"> & {
    invitees: Invitee[];
  };
};

/**
 * GraphQL query that fetches invitations sent by this user.
 *
 * @returns   GraphQL query.
 */
export function useInvites(
  options?: QueryHookOptions<InviteesData, InvitesVariables>
): QueryResult<InviteesData, InvitesVariables> {
  const [state, setState] = useState<InviteesData>();
  const { data, loading, ...rest } = useQuery<InviteesData, InvitesVariables>(
    gql`
      query Invites {
        account {
          _id
          role
          invitees {
            __typename
            ... on User {
              avatar
              email
              firstName
              lastName
            }
            ... on UserStub {
              email
            }
          }
        }
      }
    `,
    { ...options }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
