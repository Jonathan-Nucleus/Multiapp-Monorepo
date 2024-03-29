import { FC } from "react";
import Link from "next/link";

import Avatar from "desktop/app/components/common/Avatar";
import Button from "../../../../../common/Button";
import Card from "../../../../../common/Card";
import { ShieldCheck } from "phosphor-react";

import { useFollowCompany } from "shared/graphql/mutation/account/useFollowCompany";
import { Company } from "shared/graphql/query/marketplace/useFundCompanies";
import { useAccountContext } from "shared/context/Account";

interface CompanyItemProps {
  company: Company;
}

const CompanyItem: FC<CompanyItemProps> = ({ company }: CompanyItemProps) => {
  const account = useAccountContext();
  const { isFollowing, toggleFollow } = useFollowCompany(company._id);
  const managerLookup = company.fundManagers.reduce((acc, manager) => {
    acc[manager._id] = manager;
    return acc;
  }, {} as { [key: string]: Company["fundManagers"][number] });

  return (
    <>
      <div className="hidden lg:grid grid-cols-4 py-4">
        <div className="flex items-center">
          <Avatar user={company} size={56} />
          <div className="text-sm text-white ml-3">{company.name}</div>
        </div>
        <div className="flex flex-col justify-center px-1">
          {company.funds.map((fund) => (
            <div key={fund._id} className="text-sm text-white">
              {fund.name}
            </div>
          ))}
        </div>
        <div className="flex items-center px-1">
          <div className="text-sm text-white">
            {company.fundManagers?.map((manager) => (
              <p key={manager._id}>
                {manager.firstName} {manager.lastName}
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div
            className={
              account.companyIds?.includes(company._id) ? "hidden" : ""
            }
          >
            <Button
              variant="text"
              className="text-primary font-medium text-md py-0"
              onClick={toggleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>
          <Link href={`/company/${company._id}`}>
            <a>
              <Button
                variant="primary"
                className={`text-primary text-white tracking-normal ml-4 
                bg-purple-dark border border-primary-solid hover:bg-primary-solid`}
              >
                View Profile
              </Button>
            </a>
          </Link>
        </div>
      </div>
      <Card
        className={`block lg:hidden border-0 rounded-none
        bg-primary-solid/[.07] px-5 py-3`}
      >
        <div className="flex items-center">
          <Avatar user={company} size={56} shape="square" />
          <div className="w-14 ml-4">
            <div className="text-sm text-white font-medium">
              {company.postIds?.length ?? 0}
            </div>
            <div className="text-xs text-white">Posts</div>
          </div>
          <div className="w-14 ml-4">
            <div className="text-sm text-white font-medium">
              {company.followerIds?.length ?? 0}
            </div>
            <div className="text-xs text-white">Followers</div>
          </div>
          <div
            className={`${
              account.companyIds?.includes(company._id) ? "hidden" : ""
            } ml-auto`}
          >
            <Button
              variant="outline-primary"
              className="text-primary text-white"
              onClick={toggleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </div>
        <div className="text-white font-medium mt-2">{company.name}</div>
        <div className="border-t border-white/[.12] my-4" />
        <div className="text-xs text-white">
          {company.funds.filter((fund) => fund.limitedView).length > 0
            ? "Strategies Managed"
            : "Funds Managed"}
        </div>
        <div className="mb-2">
          <div className="text-sm text-primary">{company.name} Fund</div>
          {company.funds.map((fund) => (
            <div key={fund._id} className="flex mt-2">
              <Avatar
                user={managerLookup[fund.managerId]}
                size={24}
                className="overflow-hidden"
              />
              <div className="ml-2">
                <div className="text-sm text-white">
                  {managerLookup[fund.managerId]?.firstName}{" "}
                  {managerLookup[fund.managerId]?.lastName}
                </div>
                <div className="text-xs text-gray-600">CEO</div>
              </div>
              <div className="flex ml-3 mt-0.5">
                <div className="text-success">
                  <ShieldCheck color="currentColor" weight="fill" size={16} />
                </div>
                <div className="text-xs text-white ml-1">PRO</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default CompanyItem;
