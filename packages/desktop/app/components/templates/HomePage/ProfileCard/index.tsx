import { FC } from "react";
import Image from "next/image";
import { CircleWavy } from "phosphor-react";
import Link from "next/link";
import Card from "../../../common/Card";
import Avatar from "desktop/app/components/common/Avatar";
import type { User } from "backend/graphql/users.graphql";

interface ProfileProps {
  user: User;
}

const ProfileCard: FC<ProfileProps> = ({ user }) => {
  return (
    <div>
      <div className="h-24 flex items-center justify-center">
        {user.avatar && (
          <Image
            loader={() =>
              `${process.env.NEXT_PUBLIC_AVATAR_URL}/${user.avatar}`
            }
            src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${user.avatar}`}
            alt=""
            width={88}
            height={88}
            className="bg-white object-cover rounded-full"
            unoptimized={true}
          />
        )}
      </div>
      <Card className="text-center -mt-12">
        <div className="text-xl text-white font-medium mt-12">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-sm text-white opacity-60">{user.position}</div>
        <div className="flex items-center justify-center mt-3">
          <div className="relative text-success">
            <CircleWavy color="currentColor" weight="fill" size={24} />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
              AI
            </div>
          </div>
          <div className="text-white text-xs ml-1">{user.role}</div>
        </div>
        <div className="grid grid-cols-3 border-white/[.12] divide-x divide-inherit mt-5">
          <div>
            <div className="font-medium text-xl text-white">
              {user.postIds ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Posts</div>
          </div>
          <div>
            <div className="font-medium text-xl text-white">
              {user.followerIds ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Followers</div>
          </div>
          <div>
            <div className="font-medium text-xl text-white">
              {user.followingIds ?? 0}
            </div>
            <div className="text-sm text-white opacity-60">Following</div>
          </div>
        </div>
        <div className="my-5">
          <Link href="/profile">
            <a className="text-primary text-sm">See Your Profile</a>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCard;
