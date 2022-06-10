import { POST_SUMMARY_FRAGMENT, PostSummary } from "../../fragments/post";
import { User } from "backend/graphql/users.graphql";
import { Company } from "backend/graphql/companies.graphql";
import { Fund } from "backend/graphql/funds.graphql";
import {
  gql,
  QueryResult,
  QueryTuple,
  useLazyQuery,
  useQuery,
} from "@apollo/client";
import { FUND_SUMMARY_FRAGMENT } from "../../fragments/fund";
import { useEffect, useState } from "react";

export type Post = PostSummary;
export type { User, Company, Fund };

export type SearchResult = User | Company | Post | Fund;
export type GlobalSearchData = {
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

export const GLOBAL_SEARCH_FRAGMENT = gql`
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
          _id
          name
          avatar
        }
        manager {
          _id
          firstName
          lastName
          avatar
        }
        ...FundSummaryFields
      }
    }
  }
`;

export function useGlobalSearch(
  search: string
): QueryResult<GlobalSearchData, GlobalSearchVariables> {
  const [state, setState] = useState<GlobalSearchData>();
  const { data, loading, ...rest } = useQuery<
    GlobalSearchData,
    GlobalSearchVariables
  >(GLOBAL_SEARCH_FRAGMENT, {
    skip: !search,
    variables: { search: search ?? "" },
  });
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}

export function useGlobalSearchLazy(): QueryTuple<
  GlobalSearchData,
  GlobalSearchVariables
> {
  return useLazyQuery<GlobalSearchData, GlobalSearchVariables>(
    GLOBAL_SEARCH_FRAGMENT,
    {
      notifyOnNetworkStatusChange: true,
    }
  );
}
