import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DotsThreeOutlineVertical,
  LinkedinLogo,
  TwitterLogo,
  Globe,
  Copy,
  Users,
  WarningCircle,
  MinusCircle,
  Chats,
} from "phosphor-react";
import { Menu } from "@headlessui/react";
import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";
import FollowersModal from "./FollowersModal";
import { ProfilePageProps } from "../index";
import Avatar from "../../../common/Avatar";

const ProfileCard: FC<ProfilePageProps> = ({ account }: ProfilePageProps) => {
  const [isVisible, setVisible] = useState(false);
  let overviewShort: string | undefined = undefined;
  const [showFullOverView, setShowFullOverView] = useState(false);
  {
    const regexpSpace = /\s/g;
    const result = account.overview?.matchAll(regexpSpace);
    if (result) {
      const matches = Array.from(result);
      const wordsToSplit = 20;
      if (matches.length > wordsToSplit) {
        overviewShort = account.overview?.substring(
          0,
          matches[wordsToSplit].index!
        );
      }
    }
  }
  return (
    <>
      <div className="relative">
        <Card className="rounded-none lg:rounded-2xl border-brand-overlay/[.1] p-0">
          <div>
            <div className="w-full h-16 lg:h-32 bg-white/[.25] relative">
              {account.company?.background && (
                <Image
                  loader={() =>
                    `${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${account.company?.background?.url}`
                  }
                  src={`${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${account.company.background?.url}`}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  unoptimized={true}
                />
              )}
            </div>
            <div className="hidden lg:flex items-center relative mx-5 -mt-6">
              <Avatar src={account.avatar} size={120} />
              <div className="flex flex-grow items-center justify-between ml-3 mt-8">
                <div>
                  <div className="text-xl text-white font-medium">
                    {account.firstName} {account.lastName}
                  </div>
                  <div className="text-sm text-white">{account.position}</div>
                  <div className="text-sm text-primary">
                    {account.company?.name}
                  </div>
                </div>
                <div className="flex items-center">
                  <Button variant="text" className="text-primary mr-5 py-0">
                    <Chats color="currentColor" size={24} />
                  </Button>
                  <Button
                    variant="gradient-primary"
                    className="text-sm font-medium"
                  >
                    FOLLOW
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex lg:hidden items-center p-4">
              <Avatar src={account.avatar} size={80} />
              <div className="flex-grow grid grid-cols-3 divide-x divide-inherit">
                <div className="text-center px-4">
                  <div className="text-xl text-white font-medium">
                    {account.postIds?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60">Posts</div>
                </div>
                <div
                  className="text-center cursor-pointer px-4"
                  onClick={() => setVisible(true)}
                >
                  <div className="text-xl text-white font-medium">
                    {account.followerIds?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60">Followers</div>
                </div>
                <div
                  className="text-center cursor-pointer px-4"
                  onClick={() => setVisible(true)}
                >
                  <div className="text-xl text-white font-medium">
                    {account.followingIds?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60">Following</div>
                </div>
              </div>
            </div>
            <div className="lg:hidden mt-4 mx-4">
              <div className="text-white">
                {account.firstName} {account.lastName}
              </div>
              <div className="text-sm text-white opacity-60">
                {account.position}
              </div>
              <div className="text-sm text-white opacity-60">
                {account.company?.name}
              </div>
            </div>
            <div className="lg:grid grid-cols-2 mx-4 mt-4 lg:mt-2 mb-5">
              <div className="text-sm text-white">
                <div>{account.tagline}</div>
                <div className="mt-3">
                  {!overviewShort && <div>{account.overview}</div>}
                  {overviewShort && !showFullOverView && (
                    <div>
                      {overviewShort} ...
                      <span
                        className="text-primary cursor-pointer ml-1"
                        onClick={() => setShowFullOverView(true)}
                      >
                        More
                      </span>
                    </div>
                  )}
                  {overviewShort && showFullOverView && (
                    <div>
                      <div>{account.overview}</div>
                      <div>
                        <span
                          className="text-primary cursor-pointer"
                          onClick={() => setShowFullOverView(false)}
                        >
                          Show Less
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden lg:flex items-baseline justify-end">
                <div className="flex items-center divide-x divide-inherit border-white/[.12]">
                  <div className="text-center px-4">
                    <div className="text-xl text-white font-medium">
                      {account.postIds?.length ?? 0}
                    </div>
                    <div className="text-xs text-white opacity-60">Posts</div>
                  </div>
                  <div
                    className="text-center cursor-pointer px-4"
                    onClick={() => setVisible(true)}
                  >
                    <div className="text-xl text-white font-medium">
                      {account.followerIds?.length ?? 0}
                    </div>
                    <div className="text-xs text-white opacity-60">
                      Followers
                    </div>
                  </div>
                  <div
                    className="text-center cursor-pointer px-4"
                    onClick={() => setVisible(true)}
                  >
                    <div className="text-xl text-white font-medium">
                      {account.followingIds?.length ?? 0}
                    </div>
                    <div className="text-xs text-white opacity-60">
                      Following
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden mt-3 mb-5 px-4">
              <Button
                variant="gradient-primary"
                className="w-full text-sm font-medium"
              >
                FOLLOW
              </Button>
            </div>
            <div className="flex items-center p-4 border-t border-white/[.12]">
              <div className="flex items-center cursor-pointer">
                <Link href={account.linkedIn ?? "/"}>
                  <a className="flex items-center text-white">
                    <LinkedinLogo
                      color="currentColor"
                      size={24}
                      weight="fill"
                    />
                    <div className="text-sm text-primary ml-1 hidden md:block">
                      Linkedin
                    </div>
                  </a>
                </Link>
              </div>
              <div className="flex items-center cursor-pointer ml-8">
                <Link href={account.twitter ?? "/"}>
                  <a className="flex items-center text-white">
                    <TwitterLogo color="currentColor" size={24} weight="fill" />
                    <div className="text-sm text-primary ml-1 hidden md:block">
                      Twitter
                    </div>
                  </a>
                </Link>
              </div>
              <div className="flex items-center cursor-pointer ml-8">
                <Link href={account.website ?? "/"}>
                  <a className="flex items-center text-white">
                    <Globe color="currentColor" size={24} weight="fill" />
                    <div className="text-sm text-primary ml-2">Website</div>
                  </a>
                </Link>
              </div>
              <div className="ml-auto">
                <Menu>
                  <Menu.Button>
                    <div className="flex items-center">
                      <DotsThreeOutlineVertical
                        color="#808080"
                        size={24}
                        weight="fill"
                      />
                    </div>
                  </Menu.Button>
                  <Menu.Items className="z-10	absolute right-0 w-64 bg-surface-light10 shadow-md shadow-black rounded">
                    <Menu.Item>
                      <div className="divide-y border-white/[.12] divide-inherit pb-2">
                        <div className="flex items-center text-sm text-white cursor-pointer p-4">
                          <Users color="currentColor" size={24} />
                          <span className="ml-4">View All Followers</span>
                        </div>
                        <div className="flex items-center text-sm text-white cursor-pointer p-4">
                          <MinusCircle color="currentColor" size={24} />
                          <span className="ml-4">Hide User</span>
                        </div>
                        <div className="flex items-center text-sm text-white cursor-pointer p-4">
                          <WarningCircle color="currentColor" size={24} />
                          <span className="ml-4">Report Profile</span>
                        </div>
                        <div className="flex items-center text-sm text-white cursor-pointer p-4">
                          <Copy color="currentColor" size={24} />
                          <span className="ml-4">Copy Profile Link</span>
                        </div>
                      </div>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <FollowersModal
        show={isVisible}
        onClose={() => setVisible(false)}
        followers={account.followers}
        following={account.following}
      />
    </>
  );
};

export default ProfileCard;
