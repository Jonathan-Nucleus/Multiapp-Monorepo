import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "../../../common/Card";

import { AccountCompany } from "desktop/app/graphql/queries";

interface CompanyProps {
  company: AccountCompany;
}

const CompanyCard: FC<CompanyProps> = ({ company }) => {
  return (
    <div>
      <div className="h-24 flex items-center justify-center">
        {company.avatar && (
          <Image
            loader={() =>
              `${process.env.NEXT_PUBLIC_AVATAR_URL}/${company.avatar}`
            }
            src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${company.avatar}`}
            alt=""
            width={88}
            height={88}
            className="bg-white object-cover rounded-xl"
            unoptimized={true}
          />
        )}
      </div>
      <Card className="text-center -mt-12">
        <div className="text-xl text-white font-medium mt-12">
          {company.name}
        </div>
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
