import { User } from 'backend/graphql/users.graphql';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { Company } from 'backend/graphql/companies.graphql';

export type Professional = Pick<
  User,
  '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
> & {
  company: Pick<Company, '_id' | 'name'>;
};

type ProfessionalsData = {
  professionals: Professional[];
};

type ProfessionalsVariables = {
  featured: boolean;
};

export function useProfessionals(
  featured: boolean,
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
            _id
            name
          }
        }
      }
    `,
    { variables: { featured } },
  );
}