import { FC } from "react";
import CompanyItem from "./CompanyItem";
import Skeleton from "./Skeleton";
import { UserProfile } from "shared/graphql/query/user/useProfile";

interface CompaniesListProps {
  companies: UserProfile["companies"] | undefined;
}

const CompaniesList: FC<CompaniesListProps> = ({ companies }) => {
  if (!companies) {
    return <Skeleton />;
  }
  if (companies.length == 0) {
    return <></>;
  }
  return (
    <>
      <div className="px-3 lg:px-0">
        <div className="text-xl text-white font-medium">Companies</div>
        <div className="divide-y divide-inherit border-white/[.12]">
          {companies.map((company, index) => (
            <div key={index} className="py-3">
              <CompanyItem company={company} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CompaniesList;
