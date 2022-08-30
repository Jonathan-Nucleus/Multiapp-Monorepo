import { Company as GraphQLCompany } from "backend/graphql/companies.graphql";
import { gql, QueryResult, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

type FundCompaniesVariables = never;
export type Company = Pick<
  GraphQLCompany,
  "_id" | "name" | "avatar" | "postIds" | "followerIds"
> & {
  funds: Pick<
    GraphQLCompany["funds"][number],
    "_id" | "name" | "managerId" | "limitedView"
  >[];
  fundManagers: Pick<
    GraphQLCompany["fundManagers"][number],
    "_id" | "firstName" | "lastName" | "avatar" | "position" | "role"
  >[];
};
export type FundCompaniesData = {
  fundCompanies: Company[];
};

/**
 * GraphQL query that fetches all companies that have at least one fund.
 *
 * @returns   GraphQL query.
 */
export function useFundCompanies(): QueryResult<
  FundCompaniesData,
  FundCompaniesVariables
> {
  const [state, setState] = useState<FundCompaniesData>();
  const { data, loading, ...rest } = useQuery<
    FundCompaniesData,
    FundCompaniesVariables
  >(
    gql`
      query FundCompanies {
        fundCompanies {
          _id
          name
          avatar
          postIds
          followerIds
          funds {
            _id
            name
            managerId
            limitedView
          }
          fundManagers {
            _id
            firstName
            lastName
            avatar
            position
            role
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
