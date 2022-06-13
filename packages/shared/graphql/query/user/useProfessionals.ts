import { User } from "backend/graphql/users.graphql";
import { gql, QueryResult, useQuery } from "@apollo/client";
import { Company } from "backend/graphql/companies.graphql";
import { useEffect, useState } from "react";

export type Professional = Pick<
  User,
  "_id" | "firstName" | "lastName" | "avatar" | "position" | "createdAt"
> & {
  company: Pick<Company, "_id" | "name">;
};

type ProfessionalsData = {
  professionals: Professional[];
};

type ProfessionalsVariables = {
  featured: boolean;
};

export function useProfessionals(
  featured: boolean
): QueryResult<ProfessionalsData, ProfessionalsVariables> {
  const [state, setState] = useState<ProfessionalsData>();
  const { data, loading, ...rest } = useQuery<
    ProfessionalsData,
    ProfessionalsVariables
  >(
    gql`
      query Professionals($featured: Boolean) {
        professionals(featured: $featured) {
          _id
          firstName
          lastName
          avatar
          position
          company {
            _id
            name
          }
          createdAt
        }
      }
    `,
    { variables: { featured }, fetchPolicy: "cache-and-network" }
  );
  useEffect(() => {
    if (!loading && data) {
      const withDates = {
        professionals: data.professionals.map((professional) => ({
          ...professional,
          createdAt: new Date(professional.createdAt),
        })),
      };
      setState(withDates);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}
