import { gql } from '@apollo/client';
import { Fund, Accredidation } from 'backend/graphql/funds.graphql';

export type { Accredidation };

export type FundSummary = Pick<
  Fund,
  '_id' | 'name' | 'status' | 'highlights' | 'overview' | 'tags'
>;

export const FUND_SUMMARY_FRAGMENT = gql`
  fragment FundSummaryFields on Fund {
    _id
    name
    status
    highlights
    overview
    tags
  }
`;

export type FundManager = {
  manager: Pick<
    Fund['manager'],
    | '_id'
    | 'firstName'
    | 'lastName'
    | 'avatar'
    | 'position'
    | 'role'
    | 'followerIds'
    | 'postIds'
  >;
};

export const FUND_MANAGER_FRAGMENT = gql`
  fragment FundManagerFields on Fund {
    manager {
      _id
      firstName
      lastName
      avatar
      followerIds
      postIds
      position
      role
    }
  }
`;

export type FundCompany = {
  company: Pick<
    Fund['company'],
    | '_id'
    | 'name'
    | 'avatar'
    | 'background'
    | 'followerIds'
    | 'postIds'
    | 'followingIds'
  >;
};

export const FUND_COMPANY_FRAGMENT = gql`
  fragment FundCompanyFields on Fund {
    company {
      _id
      name
      avatar
      background {
        url
        x
        y
        width
        height
        scale
      }
      followerIds
      followingIds
      postIds
    }
  }
`;
