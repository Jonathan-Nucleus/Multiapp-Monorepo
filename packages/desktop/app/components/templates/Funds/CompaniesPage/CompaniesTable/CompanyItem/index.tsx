import { FC } from "react";
import { Company } from "..";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "../../../../../common/Button";
import Card from "../../../../../common/Card";
import { ShieldCheck } from "phosphor-react";

interface CompanyItemProps {
  company: Company;
}

const CompanyItem: FC<CompanyItemProps> = ({ company }: CompanyItemProps) => {
  return (
    <>
      <div className="hidden lg:grid grid-cols-4 py-4">
        <div className="flex items-center">
          <Avatar
            size={56}
            src={company.avatar}
            className="bg-white rounded-full overflow-hidden"
          />
          <div className="text-sm text-white ml-3">{company.name}</div>
        </div>
        <div className="flex items-center px-1">
          <div className="text-sm text-white">{company.name} Fund</div>
        </div>
        <div className="flex items-center px-1">
          <div className="text-sm text-white">
            {company.manager.firstName} {company.manager.lastName}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button
            variant="text"
            className="text-primary font-normal tracking-normal py-0"
          >
            FOLLOW
          </Button>
          <Button
            variant="outline-primary"
            className="text-primary text-white tracking-normal ml-4"
          >
            VIEW PROFILE
          </Button>
        </div>
      </div>
      <Card className="block lg:hidden border-0 rounded-none bg-primary-solid/[.07] px-5 py-3">
        <div className="flex items-center">
          <Avatar
            size={56}
            src={company.avatar}
            className="bg-white rounded-full overflow-hidden"
          />
          <div className="w-14 ml-4">
            <div className="text-sm text-white font-medium">
              {company.postIds.length}
            </div>
            <div className="text-xs text-white">Posts</div>
          </div>
          <div className="w-14 ml-4">
            <div className="text-sm text-white font-medium">
              {company.followerIds.length}
            </div>
            <div className="text-xs text-white">Followers</div>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline-primary"
              className="text-primary text-white tracking-normal"
            >
              FOLLOW
            </Button>
          </div>
        </div>
        <div className="text-white font-medium mt-2">{company.name}</div>
        <div className="border-t border-white/[.12] my-4" />
        <div className="text-xs text-white">FUNDS MANAGED</div>
        <div className="mb-2">
          <div className="text-sm text-primary">{company.name} Fund</div>
          <div className="flex mt-2">
            <Avatar
              size={24}
              src={company.manager.avatar}
              className="bg-white rounded-full overflow-hidden"
            />
            <div className="ml-2">
              <div className="text-sm text-white">
                {company.manager.firstName} {company.manager.lastName}
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
        </div>
      </Card>
    </>
  );
};

export default CompanyItem;
