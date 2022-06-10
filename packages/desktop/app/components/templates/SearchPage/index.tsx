import { FC } from "react";
import { useGlobalSearch } from "shared/graphql/query/search/useGlobalSearch";
import Navbar from "./Navbar";
import PostsPage from "./PostsPage";
import UsersPage from "./UsersPage";
import CompaniesPage from "./CompaniesPage";
import FundsPage from "./FundsPage";
import AllPage from "./AllPage";

export const SearchTypeOptions = {
  all: {
    title: "All",
    route: "all",
  },
  people: {
    title: "People",
    route: "people",
  },
  company: {
    title: "Companies",
    route: "companies",
  },
  post: {
    title: "Posts",
    route: "posts",
  },
  fund: {
    title: "Funds",
    route: "funds",
  },
} as const;
export type SearchType = keyof typeof SearchTypeOptions;

interface SearchPageProps {
  type: SearchType;
  query: string;
}

const SearchPage: FC<SearchPageProps> = ({ type, query }) => {
  const { data: { globalSearch } = {}, loading } = useGlobalSearch(query);
  let totalCount;
  if (type == "post") {
    totalCount = globalSearch?.posts?.length ?? 0;
  } else if (type == "people") {
    totalCount = globalSearch?.users?.length ?? 0;
  } else if (type == "company") {
    totalCount = globalSearch?.companies?.length ?? 0;
  } else if (type == "fund") {
    totalCount = globalSearch?.funds?.length ?? 0;
  } else {
    totalCount =
      (globalSearch?.posts?.length ?? 0) +
      (globalSearch?.users?.length ?? 0) +
      (globalSearch?.companies?.length ?? 0) +
      (globalSearch?.funds?.length ?? 0);
  }
  return (
    <>
      <Navbar query={query} />
      <div className="max-w-3xl mx-auto mt-9 pb-10">
        <header className="px-2 md:px-0">
          <div className="text-lg text-white font-semibold">
            {type == "all"
              ? "All Search Results"
              : SearchTypeOptions[type].title}
          </div>
          <div className={loading ? "invisible" : ""}>
            <div className="text-sm text-white opacity-80 mt-1">
              Showing <span className="font-semibold">{totalCount}</span> total
              results for <span className="font-semibold">”{query}”</span>.
            </div>
          </div>
        </header>
        <div className="mt-3">
          {type == "all" && <AllPage data={globalSearch} query={query} />}
          {type == "people" && <UsersPage users={globalSearch?.users} />}
          {type == "post" && <PostsPage posts={globalSearch?.posts} />}
          {type == "company" && (
            <CompaniesPage companies={globalSearch?.companies} />
          )}
          {type == "fund" && <FundsPage funds={globalSearch?.funds} />}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
