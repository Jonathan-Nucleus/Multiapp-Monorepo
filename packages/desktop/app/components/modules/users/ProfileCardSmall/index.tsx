import { FC } from "react";
import { CircleWavy } from "phosphor-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getInitials } from "../../../../lib/utilities";

import Avatar from "../../../common/Avatar";
import Card from "../../../common/Card";
import { AccreditationOptions } from "backend/schemas/user";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";

interface ProfileProps {
  user: UserProfile;
}

const ProfileCardSmall: FC<ProfileProps> = ({ user }: ProfileProps) => {
  const { data: session } = useSession();
  const isMyProfile = user._id == session?.user?._id;
  return (
    <div>
      <div className="h-24 flex items-center justify-center">
        <Avatar src={user.avatar} size={88} />
      </div>
      <Card className="text-center -mt-12">
        <div className="text-xl text-white font-medium mt-12">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-sm text-white opacity-60">{user.position}</div>
        <div className="flex items-center justify-center mt-3">
          <div className="relative text-success">
            <CircleWavy color="currentColor" weight="fill" size={24} />
            <div
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white"
            >
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
