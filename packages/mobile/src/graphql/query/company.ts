import { gql, useQuery, QueryResult } from '@apollo/client';
import { Company as GraphQLCompany } from 'backend/graphql/companies.graphql';
import { User as GraphQLUser } from 'backend/graphql/users.graphql';
import { VIEW_POST_FRAGMENT } from './post';

type CompanyVariables = {
  companyId: string;
};

export type FundManager = Pick<
  GraphQLCompany['funds'][number]['manager'],
  '_id' | 'firstName' | 'lastName' | 'avatar' | 'followerIds' | 'postIds'
>;

export type Fund = Pick<
  GraphQLCompany['funds'][number],
  | '_id'
  | 'name'
  | 'tags'
  | 'highlights'
  | 'overview'
  | 'level'
  | 'status'
  | 'background'
> & {
  manager: FundManager;
};

export type CompanyMember = Pick<
  GraphQLCompany['members'][number],
  '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
>;

export type FollowUser = Pick<
  GraphQLUser,
  '_id' | 'firstName' | 'lastName' | 'position' | 'avatar'
>;
export type Company = Pick<
  GraphQLCompany,
  | '_id'
  | 'name'
  | 'tagline'
  | 'overview'
  | 'avatar'
  | 'background'
  | 'postIds'
  | 'followerIds'
  | 'followingIds'
  | 'website'
  | 'linkedIn'
  | 'twitter'
> & {
  followers: FollowUser[];
  following: FollowUser[];
  funds: Fund[];
  members: CompanyMember[];
};

export type CompanyData = {
  companyProfile?: Company;
};

/**
 * GraphQL query that data for a particular company.
 *
 * @returns   GraphQL query.
 */
export function useCompany(
  companyId?: string,
): QueryResult<CompanyData, CompanyVariables> {
  return useQuery<CompanyData, CompanyVariables>(
    gql`
      ${VIEW_POST_FRAGMENT}
      query CompanyProfile($companyId: ID!) {
        companyProfile(companyId: $companyId) {
          _id
          name
          tagline
          overview
          avatar
          followerIds
          followingIds
          followers {
            _id
            firstName
            lastName
            avatar
            position
          }
          following {
            _id
            firstName
            lastName
            avatar
            position
          }
          background {
            url
            x
            y
            width
            height
            scale
          }
          funds {
            _id
            name
            tags
            highlights
            overview
            level
            status
            background {
              url
            }
            manager {
              _id
              avatar
              firstName
              lastName
              followerIds
              postIds
            }
          }
          members {
            _id
            firstName
            lastName
            position
            avatar
          }
          posts {
            ...ViewPostFields
          }
        }
      }
    `,
    {
      skip: !companyId,
      variables: { companyId: companyId ?? '' },
    },
  );
}
