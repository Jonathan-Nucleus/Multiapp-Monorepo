import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DotsThreeOutlineVertical,
  Copy,
  Users,
  WarningCircle,
  MinusCircle,
  Chats,
  Pencil,
} from "phosphor-react";
import { Menu } from "@headlessui/react";

import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";
import Avatar from "../../../common/Avatar";
import FollowersModal from "../../../modules/users/FollowersModal";

import { useFollowUser } from "shared/graphql/mutation/account";
import { useAccount } from "shared/graphql/query/account";
import { UserProfile } from "shared/graphql/query/user/useProfile";

import LinkedIn from "shared/assets/images/linkedin.svg";
import Twitter from "shared/assets/images/twitter.svg";
import Globe from "shared/assets/images/globe.svg";
import ConfirmHideUserModal from "./ConfirmHideUserModal";
import Skeleton from "./Skeleton";
import { UserProfileProps } from "../../../../types/common-props";
import { MediaType } from "backend/graphql/mutations.graphql";

interface ProfileCardProps extends UserProfileProps {
  isEditable?: boolean;
  onSelectToEditProfile: () => void;
  onSelectToEditMedia: (mediaType: MediaType) => void;
}

const ProfileCard: FC<ProfileCardProps> = ({
  user,
  isEditable = false,
  onSelectToEditProfile,
  onSelectToEditMedia,
}) => {
  const [isVisible, setVisible] = useState(false);
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const [followUser] = useFollowUser();
  const [followersModalTab, setFollowersModalTab] = useState(0);
  const [showHideUser, setShowHideUser] = useState(false);
  let overviewShort: string | undefined = undefined;
  const [showFullOverView, setShowFullOverView] = useState(false);
  {
    const regexpSpace = /\s/g;
    const result = user?.overview?.matchAll(regexpSpace);
    if (result) {
      const matches = Array.from(result);
      const wordsToSplit = 20;
      if (matches.length > wordsToSplit) {
        overviewShort = user?.overview?.substring(
          0,
          matches[wordsToSplit].index!
        );
      }
    }
  }

  if (!user) {
    return <Skeleton />;
  }

  const isFollowing = account?.followingIds?.includes(user._id);
  const isMyProfile = account?._id == user._id;
  const toggleFollowing = async () => {
    try {
      await followUser({
        variables: { follow: !isFollowing, userId: user._id },
        refetchQueries: ["Account", "UserProfile"],
      });
    } catch (error) {}
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(user.linkedIn ?? "");
  };

  return (
    <>
      <div className="relative">
        <Card className="rounded-none lg:rounded-2xl border-brand-overlay/[.1] p-0">
          <div>
            <div className="w-full h-16 lg:h-32 bg-gradient-to-r from-[#844AFF] to-primary relative">
              {user.background && (
                <Image
                  loader={() =>
                    `${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${user.background?.url}`
                  }
                  src={`${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${user.background?.url}`}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  unoptimized={true}
                />
              )}
              {isEditable && isMyProfile && (
                <div
                  className="rounded-full border border-primary flex-shrink-0 w-10 h-10 bg-surface-light10 flex items-center justify-center cursor-pointer absolute right-4 top-4"
                  onClickCapture={() => onSelectToEditMedia("BACKGROUND")}
                >
                  <Pencil size={24} color="white" />
                </div>
              )}
            </div>
            <div className="hidden lg:flex items-center relative mx-5 -mt-6">
              <div className="relative">
                <Avatar user={user} size={120} />
                {isEditable && isMyProfile && (
                  <div
                    className="rounded-full border border-primary flex-shrink-0 w-10 h-10 bg-surface-light10 flex items-center justify-center cursor-pointer absolute right-0 bottom-0"
                    onClickCapture={() => onSelectToEditMedia("AVATAR")}
                  >
                    <Pencil size={24} color="white" />
                  </div>
                )}
              </div>
              <div className="flex flex-grow items-center justify-between ml-3 mt-8">
                <div>
                  <div className="text-xl text-white font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-white">{user.position}</div>
                  <div className="text-sm text-primary">
                    {user.company?.name}
                  </div>
                </div>
                {!isMyProfile && (
                  <>
                    <div className="flex items-center">
                      <Button variant="text" className="text-primary mr-5 py-0">
                        <Chats color="currentColor" size={24} />
                      </Button>
                      <Button
                        variant="gradient-primary"
                        className="w-40 text-sm font-medium"
                        onClick={toggleFollowing}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </div>
                  </>
                )}
                {isEditable && isMyProfile && (
                  <Button
                    variant="outline-primary"
                    className="px-4"
                    onClick={onSelectToEditProfile}
                  >
                    <Pencil size={24} color="white" />
                    <div className="text-white ml-2">Edit Profile</div>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex lg:hidden items-center p-4">
              <div className="relative">
                <Avatar user={user} size={80} />
                {isEditable && isMyProfile && (
                  <div
                    className="rounded-full border border-primary flex-shrink-0 w-8 h-8 bg-surface-light10 flex items-center justify-center cursor-pointer absolute right-0 bottom-0"
                    onClickCapture={() => onSelectToEditMedia("AVATAR")}
                  >
                    <Pencil size={20} color="white" />
                  </div>
                )}
              </div>

              <div className="flex-grow grid grid-cols-3 divide-x divide-inherit">
                <div className="flex flex-wrap items-center justify-center text-center cursor-pointer px-4">
                  <div className="text-xl text-white font-medium mx-1">
                    {user.postIds?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60 mx-1">
                    Posts
                  </div>
                </div>
                <div
                  className="flex flex-wrap items-center justify-center text-center cursor-pointer px-4"
                  onClick={() => {
                    setFollowersModalTab(0);
                    setVisible(true);
                  }}
                >
                  <div className="text-xl text-white font-medium mx-1">
                    {user.followers?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60 mx-1">
                    Followers
                  </div>
                </div>
                <div
                  className="flex flex-wrap items-center justify-center text-center cursor-pointer px-4"
                  onClick={() => {
                    setFollowersModalTab(1);
                    setVisible(true);
                  }}
                >
                  <div className="text-xl text-white font-medium mx-1">
                    {user.following?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60 mx-1">
                    Following
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden flex justify-between items-center mt-4 mx-4">
              <div>
                <div className="text-white">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-white opacity-60">
                  {user.position}
                </div>
                <div className="text-sm text-white opacity-60">
                  {user.company?.name}
                </div>
              </div>
              {isEditable && isMyProfile && (
                <Button
                  variant="outline-primary"
                  className="px-4"
                  onClick={onSelectToEditProfile}
                >
                  <Pencil size={24} color="white" />
                  <div className="text-white ml-2">Edit Profile</div>
                </Button>
              )}
            </div>

            <div className="lg:grid grid-cols-2 mx-4 mt-4 lg:mt-2 mb-5">
              <div className="text-sm text-white">
                <div>{user.tagline}</div>
                <div className="mt-3">
                  {!overviewShort && <div>{user.overview}</div>}
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
                      <div>{user.overview}</div>
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
                      {user.postIds?.length ?? 0}
                    </div>
                    <div className="text-xs text-white opacity-60">Posts</div>
                  </div>
                  <div
                    className="text-center cursor-pointer px-4"
                    onClick={() => {
                      setFollowersModalTab(0);
                      setVisible(true);
                    }}
                  >
                    <div className="text-xl text-white font-medium">
                      {user.followers?.length ?? 0}
                    </div>
                    <div className="text-xs text-white opacity-60">
                      Followers
                    </div>
                  </div>
                  <div
                    className="text-center cursor-pointer px-4"
                    onClick={() => {
                      setFollowersModalTab(1);
                      setVisible(true);
                    }}
                  >
                    <div className="text-xl text-white font-medium">
                      {user.following?.length ?? 0}
                    </div>
                    <div className="text-xs text-white opacity-60">
                      Following
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!isMyProfile && (
              <div className="lg:hidden mt-3 mb-5 px-4">
                <Button
                  variant="gradient-primary"
                  className="w-full text-sm font-medium"
                  onClick={toggleFollowing}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            )}
            <div className="flex items-center p-4 border-t border-white/[.12]">
              <div className="flex items-center cursor-pointer">
                <Link href={user.linkedIn ?? "/"}>
                  <a className="flex items-center text-white" target="_blank">
                    <Image src={LinkedIn} alt="" layout={"intrinsic"} />
                    <div className="text-sm text-primary ml-1 hidden md:block">
                      Linkedin
                    </div>
                  </a>
                </Link>
              </div>
              <div className="flex items-center cursor-pointer ml-8">
                <Link href={user.twitter ?? "/"}>
                  <a className="flex items-center text-white" target="_blank">
                    <Image src={Twitter} alt="" layout={"intrinsic"} />
                    <div className="text-sm text-primary ml-1 hidden md:block">
                      Twitter
                    </div>
                  </a>
                </Link>
              </div>
              <div className="flex items-center cursor-pointer ml-8">
                <Link href={user.website ?? "/"}>
                  <a className="flex items-center text-white" target="_blank">
                    <Image src={Globe} alt="" layout={"intrinsic"} />
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
                        <div
                          className="flex items-center text-sm text-white cursor-pointer p-4"
                          onClick={() => {
                            setFollowersModalTab(0);
                            setVisible(true);
                          }}
                        >
                          <Users color="currentColor" size={24} />
                          <span className="ml-4">View All Followers</span>
                        </div>
                        {!isMyProfile && (
                          <>
                            <div
                              className="flex items-center text-sm text-white cursor-pointer p-4"
                              onClick={() => setShowHideUser(true)}
                            >
                              <MinusCircle color="currentColor" size={24} />
                              <span className="ml-4">Hide User</span>
                            </div>
                            <div className="flex items-center text-sm text-white cursor-pointer p-4">
                              <WarningCircle color="currentColor" size={24} />
                              <span className="ml-4">Report Profile</span>
                            </div>
                          </>
                        )}
                        <div
                          className="flex items-center text-sm text-white cursor-pointer p-4"
                          onClick={() => copyProfileLink()}
                        >
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
      {isVisible && (
        <FollowersModal
          show={isVisible}
          onClose={() => setVisible(false)}
          selectedTab={followersModalTab}
          followers={user.followers}
          following={user.following}
        />
      )}
      <ConfirmHideUserModal
        user={user}
        show={showHideUser}
        onClose={() => setShowHideUser(false)}
      />
    </>
  );
};

export default ProfileCard;
