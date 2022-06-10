import { FC } from "react";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";
import UsersPage from "../UsersPage";
import CompaniesPage from "../CompaniesPage";
import Spinner from "../../../common/Spinner";
import Link from "next/link";
import Button from "../../../common/Button";
import PostsPage from "../PostsPage";
import FundsPage from "../FundsPage";

interface AllPageProps {
  data: GlobalSearchData["globalSearch"] | undefined;
  query: string;
}

const AllPage: FC<AllPageProps> = ({ data, query }) => {
  return (
    <>
      {!data && (
        <div className="text-center p-5">
          <Spinner />
        </div>
      )}
      {data?.users && data.users.length > 0 && (
        <div className="mt-5">
          <header className="flex items-center justify-between">
            <div className="text-white">People</div>
            <div className="text-xs text-white/[.6]">
              {data.users.length} results
            </div>
          </header>
          <div className="mt-2">
            <UsersPage users={data.users.slice(0, 2)} />
          </div>
          {data.users.length > 2 && (
            <div className="text-center mt-3">
              <Link href={`/search/people?query=${query}`}>
                <a>
                  <Button
                    variant="text"
                    className="text-xs text-primary font-normal tracking-normal py-0"
                  >
                    See More
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </div>
      )}
      {data?.companies && data.companies.length > 0 && (
        <div className="mt-5">
          <header className="flex items-center justify-between">
            <div className="text-white">Companies</div>
            <div className="text-xs text-white/[.6]">
              {data.companies.length} results
            </div>
          </header>
          <div className="mt-2">
            <CompaniesPage companies={data.companies} />
          </div>
          {data.companies.length > 2 && (
            <div className="text-center mt-3">
              <Link href={`/search/companies?query=${query}`}>
                <a>
                  <Button
                    variant="text"
                    className="text-xs text-primary font-normal tracking-normal py-0"
                  >
                    See More
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </div>
      )}
      {data?.posts && data.posts.length > 0 && (
        <div className="mt-5">
          <header className="flex items-center justify-between">
            <div className="text-white">Posts</div>
            <div className="text-xs text-white/[.6]">
              {data.posts.length} results
            </div>
          </header>
          <div className="mt-2">
            <PostsPage posts={data.posts.slice(0, 2)} />
          </div>
          {data.posts.length > 2 && (
            <div className="text-center">
              <Link href={`/search/posts?query=${query}`}>
                <a>
                  <Button
                    variant="text"
                    className="text-xs text-primary font-normal tracking-normal py-0"
                  >
                    See More
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </div>
      )}
      {data?.funds && data.funds.length > 0 && (
        <div className="mt-5">
          <header className="flex items-center justify-between">
            <div className="text-white">Funds</div>
            <div className="text-xs text-white/[.6]">
              {data.funds.length} results
            </div>
          </header>
          <div className="mt-2">
            <FundsPage funds={data.funds.slice(0, 2)} />
          </div>
          {data.funds.length > 2 && (
            <div className="text-center">
              <Link href={`/search/funds?query=${query}`}>
                <a>
                  <Button
                    variant="text"
                    className="text-xs text-primary font-normal tracking-normal py-0"
                  >
                    See More
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllPage;
