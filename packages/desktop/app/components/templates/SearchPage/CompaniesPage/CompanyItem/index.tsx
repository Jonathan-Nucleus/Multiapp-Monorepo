import { FC } from "react";
import Link from "next/link";
import {
  useFollowCompany,
} from "shared/graphql/mutation/account/useFollowCompany";
import Avatar from "../../../../common/Avatar";
import Button from "../../../../common/Button";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";

interface CompanyItemProps {
  company: Pick<GlobalSearchData["globalSearch"]["companies"][number], "_id" | "name">;
}

const CompanyItem: FC<CompanyItemProps> = ({ company }: CompanyItemProps) => {
  const { isFollowing, toggleFollow } = useFollowCompany(company._id);

  return (
    <>
      <div className="flex items-center">
        <div className="w-14 h-14 flex flex-shrink-0 rounded-lg overflow-hidden relative">
          <Link href={`/company/${company._id}`}>
            <a>
              <Avatar user={company} shape="square" />
            </a>
          </Link>
        </div>
        <Link href={`/company/${company._id}`}>
          <a className="text-white ml-4">{company.name}</a>
        </Link>
        <Button
          variant="text"
          className="flex-shrink-0 text-sm text-primary font-medium ml-auto px-2 py-0"
          onClick={toggleFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </>
  );
};

export default CompanyItem;
