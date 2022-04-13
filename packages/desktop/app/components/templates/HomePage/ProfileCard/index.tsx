import { FC } from "react";
import Image from "next/image";
import { CircleWavy } from "phosphor-react";
import Link from "next/link";
import Card from "../../../common/Card";
import Avatar from "desktop/app/components/common/Avatar";

const profile = {
  image:
    "https://t4.ftcdn.net/jpg/02/45/56/35/360_F_245563558_XH9Pe5LJI2kr7VQuzQKAjAbz9PAyejG1.jpg",
  name: "Richard Branson",
  company: "Virgin Group",
  position: "Accredited Investor",
  posts: 64,
  followers: 987,
  following: 456,
};

const ProfileCard: FC = () => {
  return (
    <div>
      <div className="h-24 flex items-center justify-center">
        <Avatar size={88} />
      </div>
      <Card className="text-center -mt-12">
        <div className="text-xl text-white font-medium mt-12">
          {profile.name}
        </div>
        <div className="text-sm text-white opacity-60">{profile.company}</div>
        <div className="flex items-center justify-center mt-3">
          <div className="relative text-success">
            <CircleWavy color="currentColor" weight="fill" size={24} />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
              AI
            </div>
          </div>
          <div className="text-white text-xs ml-1">{profile.position}</div>
        </div>
        <div className="grid grid-cols-3 border-white/[.12] divide-x divide-inherit mt-5">
          <div>
            <div className="font-medium text-xl text-white">
              {profile.posts}
            </div>
            <div className="text-sm text-white opacity-60">Posts</div>
          </div>
          <div>
            <div className="font-medium text-xl text-white">
              {profile.followers}
            </div>
            <div className="text-sm text-white opacity-60">Followers</div>
          </div>
          <div>
            <div className="font-medium text-xl text-white">
              {profile.following}
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
