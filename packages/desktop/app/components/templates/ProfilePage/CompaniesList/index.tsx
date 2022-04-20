import { FC } from "react";
import { Company } from "backend/graphql/companies.graphql";
import CompanyItem from "./CompanyItem";

interface CompaniesListProps {
  companies: Company[];
}

const CompaniesList: FC<CompaniesListProps> = ({
  companies,
}: CompaniesListProps) => {
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
