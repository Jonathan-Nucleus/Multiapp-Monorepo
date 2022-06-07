import React, { FC } from "react";
import { CircleWavy } from "phosphor-react";
import Link from "next/link";
import { getInitials } from "../../../../lib/utilities";

import Avatar from "../../../common/Avatar";
import Card from "../../../common/Card";
import { AccreditationOptions } from "backend/schemas/user";
import { UserProfile } from "shared/graphql/query/user/useProfile";
import { useAccountContext } from "shared/context/Account";

interface ProfileProps {
  user: UserProfile | undefined;
}

const ProfileCardSmall: FC<ProfileProps> = ({ user }: ProfileProps) => {
  const account = useAccountContext();
  if (!user) {
    return (
      <div className="animate-pulse">
        <div className="h-24 flex items-center justify-center">
          <div className="w-[88px] h-[88px] rounded-full bg-skeleton" />
        </div>
        <Card className="text-center -mt-12">
          <div className="flex items-center justify-center flex-col">
            <div className="w-1/2 h-1 mt-12 bg-skeleton rounded-lg" />
            <div className="w-1/4 h-1 mt-3 bg-skeleton rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-x-4 mt-5">
            <div className="bg-skeleton rounded-md h-8" />
            <div className="bg-skeleton rounded-md h-8" />
            <div className="bg-skeleton rounded-md h-8" />
          </div>
        </Card>
      </div>
    );
  }
  const isMyProfile = user._id == account._id;
  return (
    <div>
      <Link href={`/profile/${isMyProfile ? "me" : user._id}`}>
        <a>
          <div className="h-24 flex items-center justify-center">
            <Avatar user={user} size={88} />
          </div>
        </a>
      </Link>

      <Card className="text-center -mt-12">
        <Link href={`/profile/${user._id}`}>
          <a>
            <div className="text-xl text-white font-medium mt-12 capitalize">
              {user.firstName} {user.lastName}
            </div>
          </a>
        </Link>
        <div className="text-sm text-white opacity-60">{user.position}</div>
        <div className="flex items-center justify-center mt-3">
          <div className="relative text-success">
            <CircleWavy color="currentColor" weight="fill" size={24} />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
              {getInitials(AccreditationOptions[user.accreditation].label)}
            </div>
          </div>
          <div className="text-white text-xs ml-1">
            {AccreditationOptions[user.accreditation].label}
          </div>
        </div>
        <div className="grid grid-cols-3 border-white/[.12] divide-x divide-inherit mt-5">
          <div>
            <div className="font-medium text-xl text-white">
              {user.postIds?.length ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Posts</div>
          </div>
          <div>
            <div className="font-medium text-xl text-white">
              {user.followerIds?.length ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Followers</div>
          </div>
          <div>
            <div className="font-medium text-xl text-white">
              {user.followingIds?.length ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Following</div>
          </div>
        </div>
        <div className="mt-5 mb-3">
          <Link href={isMyProfile ? "/profile/me" : `/profile/${user._id}`}>
            <a className="text-primary text-sm">
              {isMyProfile ? <>See Your Profile</> : <>See Profile</>}
            </a>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCardSmall;
