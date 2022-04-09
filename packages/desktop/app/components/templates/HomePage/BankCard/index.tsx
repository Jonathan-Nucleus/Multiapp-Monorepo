import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from '../../../common/Card'

const profile = {
  image:
    "https://static.wikia.nocookie.net/logopedia/images/d/db/Alpha-bank-bulgaria-vector-logo.png",
  name: "Alpha Bank",
  posts: 64,
  followers: 987,
  following: 456,
};

const BankCard: FC = () => {
  return (
    <div>
      <div className="h-24 flex items-center justify-center">
        <Image
          loader={() => profile.image}
          src={profile.image}
          alt=""
          width={88}
          height={88}
          className="bg-white object-cover rounded-xl"
          unoptimized={true}
        />
      </div>
      <Card className="text-center -mt-12">
        <div className="text-xl text-white font-medium mt-12">
          {profile.name}
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
          <Link href="/bank">
            <a className="text-primary text-sm">See Your Profile</a>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default BankCard;
