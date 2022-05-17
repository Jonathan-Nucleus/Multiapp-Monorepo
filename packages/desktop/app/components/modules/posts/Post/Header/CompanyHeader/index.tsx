import { FC } from "react";
import Link from "next/link";
import Avatar from "../../../../../common/Avatar";
import { PostSummary } from "shared/graphql/fragments/post";
import Button from "../../../../../common/Button";
import {
  useFollowCompany,
} from "shared/graphql/mutation/account/useFollowCompany";

interface CompanyHeaderProps {
  company: Exclude<PostSummary["company"], undefined>;
  createdAt: string;
}

const CompanyHeader: FC<CompanyHeaderProps> = ({ company, createdAt }) => {
  const { isFollowing, toggleFollow } = useFollowCompany(company._id);
  return (
    <>
      <div className="flex items-center">
        <div>
          <Link href={`/company/${company._id}`}>
            <a>
              <Avatar size={56} user={company} />
            </a>
          </Link>
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <div>
              <div className="flex items-center">
                <Link href={`/company/${company._id}`}>
                  <a className="text-white capitalize">
                    {company.name}
                  </a>
                </Link>
                {!isFollowing && (
                  <div className="flex items-center">
                    <div className="mx-1 text-white opacity-60">•</div>
                    <div className="flex">
                      <Button
                        variant="text"
                        className="text-tiny text-primary tracking-wider font-medium py-0"
                        onClick={toggleFollow}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-white opacity-60">
                {createdAt}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyHeader;

