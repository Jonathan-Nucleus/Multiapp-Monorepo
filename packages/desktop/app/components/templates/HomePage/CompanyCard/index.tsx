import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "../../../common/Card";
import { CompanyType } from "desktop/app/types/common-props";
import Avatar from "../../../common/Avatar";

interface CompanyProps {
  company: CompanyType;
}

const CompanyCard: FC<CompanyProps> = ({ company }) => {
  return (
    <div>
      <Link href={`/company/${company._id}`}>
        <a>
          <div className="h-24 flex items-center justify-center">
            {company.avatar && (
              <Avatar src={company.avatar} size={88} shape="square" />
            )}
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
