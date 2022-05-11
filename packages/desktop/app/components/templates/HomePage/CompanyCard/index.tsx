import { FC } from "react";
import Link from "next/link";
import Card from "../../../common/Card";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";
import Avatar from "../../../common/Avatar";
import Skeleton from "./Skeleton";

interface CompanyCardProps {
  user: UserProfile | undefined;
}

const CompanyCard: FC<CompanyCardProps> = ({ user }) => {
  if (!user) {
    return <Skeleton />;
  }
  const company = user.companies.length > 0 ? user.companies[0] : undefined;
  if (!company) {
    return <></>;
  }
  return (
    <div>
      <Link href={`/company/${company._id}`}>
        <a>
          <div className="h-24 flex items-center justify-center">
            <Avatar user={company} size={88} shape="square" />
          </div>
        </a>
      </Link>
      <Card className="text-center -mt-12">
        <Link href={`/company/${company._id}`}>
          <a>
            <div className="text-xl text-white font-medium mt-12">
              {company.name}
            </div>
          </a>
        </Link>
        <div className="grid grid-cols-3 border-white/[.12] divide-x divide-inherit mt-5">
          <div>
            <div className="font-medium text-xl text-white">
              {company.postIds?.length ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Posts</div>
          </div>
          <div>
            <div className="font-medium text-xl text-white">
              {company.followerIds?.length ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Followers</div>
          </div>
          <div>
            <div className="font-medium text-xl text-white">
              {company.followingIds?.length ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Following</div>
          </div>
        </div>
        <div className="my-5">
          <Link href={`/company/${company._id}`}>
            <a className="text-primary text-sm">See Your Profile</a>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default CompanyCard;
