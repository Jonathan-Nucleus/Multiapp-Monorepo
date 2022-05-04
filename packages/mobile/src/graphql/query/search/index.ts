import { gql, QueryResult, useQuery } from '@apollo/client';

import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'mobile/src/graphql/fragments/post';
import {
  FUND_SUMMARY_FRAGMENT,
  FundSummary,
} from 'mobile/src/graphql/fragments/fund';
import { Company } from 'backend/graphql/companies.graphql';
import { User } from 'backend/graphql/users.graphql';
import { Fund } from 'backend/graphql/funds.graphql';

export type Post = PostSummary;

type GlobalSearchData = {
  globalSearch: {
    users: User[];
    companies: Company[];
    posts: Post[];
    funds: Fund[];
  };
};

type GlobalSearchVariables = {
  search: string;
};

export function useGlobalSearch(
  search: string,
): QueryResult<GlobalSearchData, GlobalSearchVariables> {
  return useQuery<GlobalSearchData, GlobalSearchVariables>(
    gql`
      ${FUND_SUMMARY_FRAGMENT}
      ${POST_SUMMARY_FRAGMENT}
      query GlobalSearch($search: String) {
        globalSearch(search: $search) {
          users {
            _id
            firstName
            lastName
            avatar
            position
          }
          companies {
            _id
            name
            avatar
          }
          posts {
            ...PostSummaryFields
          }
          funds {
            company {
              name
              avatar
            }
            ...FundSummaryFields
          }
        }
      }
    `,
    {
      skip: !search,
      variables: { search: search ?? '' },
    },
  );
}
