import { FC, Fragment, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DotsThreeOutlineVertical,
  Users,
  WarningCircle,
  MinusCircle,
  Chats,
  Pencil,
  Globe,
  ShieldCheck,
} from "phosphor-react";
import { Menu, Transition } from "@headlessui/react";

import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";
import Avatar, { backgroundUrl } from "../../../common/Avatar";
import FollowersModal from "../../../modules/users/FollowersModal";

import LinkedIn from "shared/assets/images/linkedin.svg";
import Twitter from "shared/assets/images/twitter.svg";
import ConfirmHideUserModal from "./ConfirmHideUserModal";
import { MediaType } from "backend/graphql/mutations.graphql";
import { UserProfile } from "shared/graphql/query/user/useProfile";
import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";
import { useAccountContext } from "shared/context/Account";
import MediaEditorModal from "../../../modules/users/MediaEditorModal";

interface ProfileCardProps {
  user: UserProfile;
  isEditable?: boolean;
  onSelectToEditProfile: () => void;
}

const ProfileCard: FC<ProfileCardProps> = ({
  user: userData,
  isEditable = false,
  onSelectToEditProfile,
}) => {
  const account = useAccountContext();
  const isMyProfile = account?._id == userData._id;
  const user = isMyProfile ? account : userData;

  const { isFollowing, toggleFollow } = useFollowUser(user._id);
  const [isVisible, setVisible] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState(0);
  const [showHideUser, setShowHideUser] = useState(false);
  const [showFullOverView, setShowFullOverView] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState<MediaType>();

  let overviewShort: string | undefined = undefined;
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

  const { background } = user;

  const renderPro = useCallback(() => {
    const isVerified =
      user?.role === "VERIFIED" || user?.role === "PROFESSIONAL";
    const hasSpecRole =
      user?.role === "FA" ||
      user?.role === "FO" ||
      user?.role === "IA" ||
      user?.role === "RIA";
    if (!isVerified && !hasSpecRole) {
      return null;
    }

    return (
      <div className={"flex flex-row items-center ml-2"}>
        <ShieldCheck
          className={`${
            isVerified ? "text-success" : "text-primary-solid"
          } ml-1.5`}
          color="currentColor"
          weight="fill"
          size={16}
        />
        <div className="text-white text-tiny ml-1.5 text-tiny">
          {hasSpecRole ? user.role : user.role === "PROFESSIONAL" ? "PRO" : ""}
        </div>
      </div>
    );
  }, [user]);

  return (
    <>
      <div className="relative">
        <Card className="rounded-none lg:rounded-2xl border-brand-overlay/[.1] p-0">
          <div>
            <div className="w-full h-16 lg:h-32 bg-gradient-to-r from-[#844AFF] to-primary relative">
              {background && (
                <Image
                  loader={() => backgroundUrl(user._id, background.url)}
                  src={backgroundUrl(user._id, background.url)}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  unoptimized={true}
                />
              )}
              {isEditable && isMyProfile && (
                <div
                  className="rounded-full border border-primary flex-shrink-0 w-10 h-10 bg-surface-light10 flex items-center justify-center cursor-pointer absolute right-4 top-4"
                  onClickCapture={() => setMediaToEdit("BACKGROUND")}
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
                    onClickCapture={() => setMediaToEdit("AVATAR")}
                  >
                    <Pencil size={24} color="white" />
                  </div>
                )}
              </div>
              <div className="flex flex-grow items-center justify-between ml-3 mt-8">
                <div>
                  <div className={"flex flex-row items-center"}>
                    <div className="text-xl text-white font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    {renderPro()}
                  </div>
                  <div className="text-sm text-white">{user.position}</div>
                  <div>
                    <Link href={`/company/${user.company?._id}`}>
                      <a className="text-sm text-primary">
                        {user.company?.name}
                      </a>
                    </Link>
                  </div>
                </div>
                {!isMyProfile && (
                  <>
                    <div className="flex items-center">
                      <Link href={`/messages?user=${user._id}`}>
                        <a>
                          <Button
                            variant="text"
                            className="text-primary mr-5 py-0"
                          >
                            <Chats color="currentColor" size={24} />
                          </Button>
                        </a>
                      </Link>
                      <Button
                        variant="gradient-primary"
                        className="w-40 text-sm font-medium"
                        onClick={toggleFollow}
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
                    <div className="text-white font-semibold uppercase ml-2">
                      Edit Profile
                    </div>
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
                    onClickCapture={() => setMediaToEdit("AVATAR")}
                  >
                    <Pencil size={20} color="white" />
                  </div>
                )}
              </div>

              <div className="flex-grow grid grid-cols-3 divide-x divide-inherit">
                <div className="flex flex-wrap items-center justify-center text-center cursor-pointer px-4">
                  <div className="text-xl text-white font-medium mx-1">
                    {user.postCount}
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
                    {user.followerCount}
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
                    {user.followingCount}
                  </div>
                  <div className="text-xs text-white opacity-60 mx-1">
                    Following
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden flex justify-between items-center mt-4 mx-4">
              <div>
                <div className={"flex flex-row items-center"}>
                  <div className="text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  {renderPro()}
                </div>
                <div className="text-sm text-white opacity-60">
                  {user.position}
                </div>
                <div>
                  <Link href={`/company/${user.company?._id}`}>
                    <a className="text-sm text-primary">{user.company?.name}</a>
                  </Link>
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
                      {user.postCount}
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
                  onClick={toggleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            )}
            <div className="flex items-center p-4 border-t border-white/[.12]">
              {user.linkedIn && (
                <div className="flex items-center cursor-pointer mr-8">
                  <Link href={user.linkedIn}>
                    <a
                      className="flex items-center text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={LinkedIn}
                        alt=""
                        layout="intrinsic"
                        width={24}
                        height={24}
                      />
                      <div className="text-sm text-primary ml-2 hidden md:block">
                        Linkedin
                      </div>
                    </a>
                  </Link>
                </div>
              )}
              {user.twitter && (
                <div className="flex items-center cursor-pointer mr-8">
                  <Link href={user.twitter}>
                    <a
                      className="flex items-center text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={Twitter}
                        alt=""
                        layout="intrinsic"
                        width={24}
                        height={24}
                      />
                      <div className="text-sm text-primary ml-2 hidden md:block">
                        Twitter
                      </div>
                    </a>
                  </Link>
                </div>
              )}
              {user.website && (
                <div className="flex items-center cursor-pointer mr-8">
                  <Link href={user.website}>
                    <a
                      className="flex items-center text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe color="currentColor" size={24} weight="fill" />
                      <div className="text-sm text-primary ml-2">Website</div>
                    </a>
                  </Link>
                </div>
              )}
              <div className="ml-auto">
                <Menu>
                  <Menu.Button className="block">
                    <DotsThreeOutlineVertical
                      color="currentColor"
                      size={24}
                      weight="fill"
                      className="text-white opacity-60"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="z-10	absolute right-0 w-64 bg-background-popover shadow-md shadow-black rounded">
                      <div className="py-2">
                        <div
                          className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
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
                              className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                              onClick={() => setShowHideUser(true)}
                            >
                              <MinusCircle color="currentColor" size={24} />
                              <span className="ml-4">Hide User</span>
                            </div>
                            <div
                              className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                              onClick={() => {}}
                            >
                              <WarningCircle color="currentColor" size={24} />
                              <span className="ml-4">Report Profile</span>
                            </div>
                          </>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
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
      {mediaToEdit && (
        <MediaEditorModal
          mediaType={mediaToEdit}
          user={user}
          show={!!mediaToEdit}
          onClose={() => setMediaToEdit(undefined)}
        />
      )}
    </>
  );
};

export default ProfileCard;
