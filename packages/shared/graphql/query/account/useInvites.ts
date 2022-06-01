import { gql, QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { User as GraphQLUser, Stub } from "backend/graphql/users.graphql";

type User = Pick<
  GraphQLUser,
  "_id" | "firstName" | "lastName" | "email" | "avatar"
>;
export type { User };

export type Invitee = Stub | User;
export type InvitesVariables = never;
export type InviteesData = {
  account: Pick<GraphQLUser, "_id" | "role"> & {
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
              _id
              avatar
              email
              firstName
              lastName
            }
            ... on UserStub {
              _id
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
