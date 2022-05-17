import Head from "next/head";
import { NextPageWithLayout } from "../../app/types/next-page";
import { useRouter } from "next/router";
import SearchPage, {
  SearchTypeOptions,
} from "../../app/components/templates/SearchPage";

const routeOptions = Object.keys(SearchTypeOptions).map(key => {
  return { type: key, ...SearchTypeOptions[key] };
});

const Search: NextPageWithLayout = () => {
  const router = useRouter();
  const { type: route, query } = router.query as Record<string, string>;
  const validRoute = routeOptions.find(item => item.route == route);
  if (!validRoute || !query) {
    router.replace("/");
    return <></>;
  }
  return (
    <div>
      <Head>
        <title>Search {validRoute.title} - Prometheus</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchPage type={validRoute.type} query={query} />
    </div>
  );
};

Search.layout = "main-fluid";
Search.middleware = "auth";

export default Search;
