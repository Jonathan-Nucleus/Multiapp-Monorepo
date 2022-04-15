import { FC } from "react";

import CompanyItem from "./Company";
import Button from "../../../common/Button";
import type { Company } from "backend/graphql/companies.graphql";

interface CompaniesProps {
  companies: Company[];
}

const CompanyList: FC<CompaniesProps> = ({ companies }) => {
  return (
    <>
      <div className="font-medium text-white ml-4 mt-4 md:m-0">Companies</div>
      {companies.map((company) => (
        <div key={company._id} className="border-b border-white/[.12]">
          <CompanyItem company={company} />
        </div>
      ))}
    </>
  );
};

export default CompanyList;
