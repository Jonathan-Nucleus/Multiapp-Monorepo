import { FC } from "react";
import Card from "../Card";
import Image from "next/image";
import Link from "next/link";
import {
  ChatCenteredText,
  DotsThreeOutlineVertical,
  Share,
  ShieldCheck,
  ThumbsUp,
  LinkedinLogo,
  TwitterLogo,
  Globe,
} from "phosphor-react";
import Button from "../Button";

interface ProfileProps {
  data: {
    profile: {
      image: string;
      thumbnail: string;
      name: string;
      type: string;
      position: string;
    };
    description: string;
    followers: number;
    posts: number;
    following: number;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

const Profile: FC<ProfileProps> = ({ data }: ProfileProps) => {
  return (
    <Card className="border-0 p-0">
      <div className="w-full h-32 relative">
        <Image
          loader={() => data.profile.image}
          src={data.profile.image}
          alt=""
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex items-center px-4 pt-4 -mt-12">
        <div className="flex items-center">
          <div className="w-24 h-24 flex items-center justify-center relative shadow-2xl shadow-black">
            <Image
              loader={() => data.profile.image}
              src={data.profile.image}
              alt=""
              width={96}
              height={96}
              className="rounded-md"
              unoptimized={true}
              objectFit="fill"
            />
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <div className="text-white">{data.profile.name}</div>
            </div>
            <div className="text-xs text-white opacity-60">
              {data.profile.position}
            </div>
          </div>
        </div>
        <Button
          variant="gradient-primary"
          className="w-44 h-10	mt-4 uppercase tracking-normal font-normal py-0"
        >
          FOLLOW
        </Button>
      </div>
      <div className="flex items-center">
        <div className="text-sm text-white opacity-90 px-4 mt-4">
          {data.description}
        </div>
        <div className="w-80 flex justify-around">
          <div className="text-center">
            <div>{data.posts}</div>
            <div className="text-xs text-white opacity-60">Posts</div>
          </div>
          <div className="text-center border-r border-l w-1/3 border-gray-400">
            <div>{data.followers}</div>
            <div className="text-xs text-white opacity-60">Posts</div>
          </div>
          <div className="text-center">
            <div>{data.following}</div>
            <div className="text-xs text-white opacity-60">Posts</div>
          </div>
        </div>
      </div>

      {/*
      {!!data.image && (
        <div className="relative h-80 mt-5 border-b border-white/[.12]">
          <Image
            loader={() => data.image}
            src={data.image}
            alt=""
            layout="fill"
            unoptimized={true}
            objectFit="cover"
          />
        </div>
      )} */}

      <div className="flex items-center p-4 border-t border-white/[.12]">
        <div className="flex items-center cursor-pointer mr-4">
          <Link href={data.linkedin}>
            <a className="flex items-center">
              <LinkedinLogo size={24} weight="fill" />
              <div className="text-primary ml-2">Linkedin</div>
            </a>
          </Link>
        </div>

        <div className="flex items-center cursor-pointer mr-4">
          <Link href={data.twitter}>
            <a className="flex items-center">
              <TwitterLogo size={24} weight="fill" />
              <div className="text-primary ml-2">Twitter</div>
            </a>
          </Link>
        </div>

        <div className="flex items-center cursor-pointer">
          <Link href={data.website}>
            <a className="flex items-center">
              <Globe size={24} weight="fill" />
              <div className="text-primary ml-2">Website</div>
            </a>
          </Link>
        </div>

        <div className="ml-auto flex items-center opacity-60">
          <DotsThreeOutlineVertical color="white" weight="light" size={24} />
        </div>
      </div>
    </Card>
  );
};

export default Profile;
