import { FC } from "react";

import CompanyItem from "./Company";
import Button from "../../../common/Button";
import type { Company } from "backend/graphql/companies.graphql";
import { useAccount } from "desktop/app/graphql/queries";
import { useFollowCompany } from "desktop/app/graphql/mutations/profiles";

const CompanyList: FC = () => {
  const { data: userData, loading, refetch } = useAccount();
  const [followCompany] = useFollowCompany();

  const companies: Company[] = userData?.account.companies ?? [];

  const handleToggleFollowCompany = async (
    id: string,
    follow
  ): Promise<void> => {
    try {
      const { data } = await followCompany({
        variables: { follow: follow, companyId: id },
      });
      if (data?.followCompany) {
        refetch();
      } else {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className="font-medium text-white ml-4 mt-4 md:m-0">Companies</div>
      {companies.map((company) => (
        <div key={company._id} className="border-b border-white/[.12]">
          <CompanyItem
            company={company}
            handleToggleFollowCompany={handleToggleFollowCompany}
            userId={userData?.account._id}
          />
        </div>
      ))}
    </>
  );
};

export default CompanyList;
