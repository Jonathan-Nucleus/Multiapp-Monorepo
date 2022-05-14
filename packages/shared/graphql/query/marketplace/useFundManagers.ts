import { gql, useQuery, QueryResult } from "@apollo/client";
import { UserProfile } from "backend/graphql/users.graphql";
import { Company } from "backend/graphql/companies.graphql";
import {
  FundSummary,
  FundManager as FundManagerFragment,
} from "shared/graphql/fragments/fund";
import { useEffect, useState } from "react";

export type FundManager = FundManagerFragment["manager"] &
  Pick<UserProfile, "managedFundsIds" | "position" | "role"> & {
    company: Pick<Company, "_id" | "name" | "avatar">;
  };
export type FundListItem = Pick<FundSummary, "_id" | "name">;
export type FundManagersData = {
  fundManagers?: {
    managers: FundManager[];
    funds: FundListItem[];
  };
};

type FundManagersVariables = never;

/**
 * GraphQL query that fetches fund managers for the current user.
 *
 * @returns   GraphQL query.
 */
export function useFundManagers(): QueryResult<
  FundManagersData,
  FundManagersVariables
> {
  const [state, setState] = useState<FundManagersData>();
  const { data, loading, ...rest } = useQuery<
    FundManagersData,
    FundManagersVariables
  >(
    gql`
      query FundManagers {
        fundManagers {
          funds {
            _id
            name
          }
          managers {
            _id
            firstName
            lastName
            role
            avatar
            followerIds
            postIds
            managedFundsIds
            position
            company {
              _id
              name
              avatar
            }
          }
        }
      }
    `
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
