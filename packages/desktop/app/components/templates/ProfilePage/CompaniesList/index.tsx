import { FC, useMemo } from "react";
import CompanyItem from "./CompanyItem";
import { UserProfile } from "shared/graphql/query/user/useProfile";

interface CompaniesListProps {
  companies: UserProfile["companies"];
}

const CompaniesList: FC<CompaniesListProps> = ({ companies }) => {
  const nonChannels = useMemo(
    () => companies.filter((company) => !company.isChannel),
    [companies]
  );
  return (
    <>
      <div className="px-3 lg:px-0">
        <div className="text-xl text-white font-medium">Companies</div>
        <div className="divide-y divide-inherit border-white/[.12]">
          {nonChannels.map((company, index) => (
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
