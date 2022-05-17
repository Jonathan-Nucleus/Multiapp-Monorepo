import { FC } from "react";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";
import Skeleton from "./Skeleton";
import Card from "../../../common/Card";
import CompanyItem from "./CompanyItem";

interface CompaniesPageProps {
  companies: GlobalSearchData["globalSearch"]["companies"] | undefined;
}

const CompaniesPage: FC<CompaniesPageProps> = ({ companies }) => {
  if (!companies) {
    return <Skeleton />;
  }
  return (
    <>
      {companies.map((company, index) => (
        <div key={index} className="mb-4">
          <Card className="bg-background-header border-none rounded-lg p-4">
            <CompanyItem company={company} />
          </Card>
        </div>
      ))}
    </>
  );
};

export default CompaniesPage;
