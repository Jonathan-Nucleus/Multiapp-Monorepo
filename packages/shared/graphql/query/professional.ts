import { gql, useQuery, QueryResult } from '@apollo/client';
import { User } from 'backend/graphql/users.graphql';

type ProfessionalsVariables = {
  featured: boolean;
};
export type ProfessionalsData = {
  professionals: User[];
};

/**
 * GraphQL query that fetches data for a professionals.
 *
 * @param featured  Optional flag for fetching only featured professionals.
 *                  Defaults to true.
 *
 * @returns   GraphQL query.
 */
export function useProfessionals(
  featured = true,
): QueryResult<ProfessionalsData, ProfessionalsVariables> {
  return useQuery<ProfessionalsData, ProfessionalsVariables>(
    gql`
      query Professionals($featured: Boolean) {
        professionals(featured: $featured) {
          _id
          firstName
          lastName
          avatar
          position
          company {
            name
          }
        }
      }
    `,
    { variables: { featured: true } },
  );
}
