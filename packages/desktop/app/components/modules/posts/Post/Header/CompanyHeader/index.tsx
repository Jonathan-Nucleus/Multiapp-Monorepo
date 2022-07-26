import { FC } from "react";
import Link from "next/link";
import { Star } from "phosphor-react";

import Avatar from "../../../../../common/Avatar";
import Button from "../../../../../common/Button";

import { PostSummary } from "shared/graphql/fragments/post";
import { useFollowCompany } from "shared/graphql/mutation/account/useFollowCompany";
import { useAccountContext } from "shared/context/Account";

interface CompanyHeaderProps {
  company: Exclude<PostSummary["company"], undefined>;
  createdAt: string;
  highlighted?: boolean;
}

const CompanyHeader: FC<CompanyHeaderProps> = ({
  company,
  createdAt,
  highlighted = false,
}) => {
  const { isFollowing, toggleFollow } = useFollowCompany(company._id);
  const account = useAccountContext();
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
                  <a className="text-white capitalize">{company.name}</a>
                </Link>
                {!isFollowing && !account.companyIds?.includes(company._id) && (
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
              <div className="flex flex-row items-center text-xs text-white/[0.6]">
                {highlighted ? (
                  <div className="flex flex-row items-center text-white/[0.8] mr-1">
                    <div className="text-primary-solid inline-block mr-1 mb-0.5">
                      <Star size={14} color="currentColor" weight="fill" />
                    </div>{" "}
                    <span>Featured Post</span>
                    <span className="ml-1">•</span>
                  </div>
                ) : (
                  ""
                )}
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
