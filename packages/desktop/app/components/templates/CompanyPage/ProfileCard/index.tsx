import { FC, Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DotsThreeOutlineVertical,
  Globe,
  Copy,
  Chats,
  Share,
  Pencil,
} from "phosphor-react";
import { Menu, Transition } from "@headlessui/react";

import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";
import Avatar, { backgroundUrl } from "../../../common/Avatar";
import { CompanyProfile } from "shared/graphql/query/company/useCompany";
import FollowersModal from "../../../modules/users/FollowersModal";
import { useFollowCompany } from "shared/graphql/mutation/account/useFollowCompany";
import EditModal from "../EditModal";
import { MediaType } from "backend/graphql/mutations.graphql";
import MediaEditorModal from "../../../modules/users/MediaEditorModal";
import Twitter from "shared/assets/images/twitter.svg";
import LinkedIn from "shared/assets/images/linkedin.svg";

interface CompanyPageProps {
  company: CompanyProfile;
  isEditable?: boolean;
}

const ProfileCard: FC<CompanyPageProps> = ({
  company,
  isEditable,
}: CompanyPageProps) => {
  const [isVisible, setVisible] = useState(false);
  const [editableModal, setEditableModal] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState<MediaType>();
  const { isFollowing, toggleFollow } = useFollowCompany(company._id);
  let overviewShort: string | undefined = undefined;
  const [showFullOverView, setShowFullOverView] = useState(false);
  {
    const regexpSpace = /\s/g;
    const result = company.overview?.matchAll(regexpSpace);
    if (result) {
      const matches = Array.from(result);
      const wordsToSplit = 20;
      if (matches.length > wordsToSplit) {
        overviewShort = company.overview?.substring(
          0,
          matches[wordsToSplit].index!
        );
      }
    }
  }

  const { background: companyBackground } = company;
  return (
    <>
      <div className="relative">
        <Card className="rounded-none lg:rounded-2xl border-brand-overlay/[.1] p-0">
          <div>
            <div className="w-full h-16 lg:h-32 bg-gradient-to-r from-[#844AFF] to-primary relative">
              {companyBackground?.url && (
                <Image
                  loader={() =>
                    backgroundUrl(company._id, companyBackground.url)
                  }
                  src={backgroundUrl(company._id, companyBackground.url)}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  unoptimized={true}
                />
              )}
              {isEditable && (
                <div
                  onClick={() => setMediaToEdit("BACKGROUND")}
                  className="rounded-full border border-primary flex-shrink-0 w-10 h-10 bg-surface-light10 flex items-center justify-center cursor-pointer absolute right-4 top-4"
                >
                  <Pencil size={24} color="white" />
                </div>
              )}
            </div>
            <div className="hidden lg:flex relative mx-5">
              <div className="w-[120px] h-[120px] bg-background rounded-2xl relative overflow-hidden -mt-12">
                <Avatar user={company} size={120} shape="square" />
                {isEditable && (
                  <div
                    onClick={() => setMediaToEdit("AVATAR")}
                    className="rounded-full border border-primary flex-shrink-0 w-10 h-10 bg-surface-light10 flex items-center justify-center cursor-pointer absolute right-0 bottom-0"
                  >
                    <Pencil size={24} color="white" />
                  </div>
                )}
              </div>
              <div className="flex flex-grow justify-between ml-4 mt-4">
                <div>
                  <div className="text-xl text-white font-medium">
                    {company.name}
                  </div>
                </div>
                <div className="flex items-center">
                  {isEditable ? (
                    <Button
                      variant="gradient-primary"
                      className="w-40 text-sm font-medium"
                      onClick={() => setEditableModal(true)}
                    >
                      Edit Company
                    </Button>
                  ) : (
                    <Button
                      variant="gradient-primary"
                      className="w-40 text-sm font-medium"
                      onClick={toggleFollow}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex lg:hidden items-center p-4">
              <div className="w-[80px] h-[80px] bg-background rounded-2xl relative overflow-hidden -mt-12">
                <div className="relative">
                  <Avatar user={company} size={80} shape="square" />
                  {isEditable && (
                    <div
                      onClick={() => setMediaToEdit("AVATAR")}
                      className="rounded-full border border-primary flex-shrink-0 w-8 h-8 bg-surface-light10 flex items-center justify-center cursor-pointer absolute right-0 bottom-0"
                    >
                      <Pencil size={18} color="white" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-grow grid grid-cols-3 divide-x divide-inherit">
                <div className="flex flex-wrap items-center justify-center text-center cursor-pointer px-4">
                  <div className="text-xl text-white font-medium mx-1">
                    {company.postIds?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60 mx-1">
                    Posts
                  </div>
                </div>
                <div
                  className="flex flex-wrap items-center justify-center text-center cursor-pointer px-4"
                  onClick={() => setVisible(true)}
                >
                  <div className="text-xl text-white font-medium mx-1">
                    {company.followerIds?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60 mx-1">
                    Followers
                  </div>
                </div>
                <div
                  className="flex flex-wrap items-center justify-center text-center cursor-pointer px-4"
                  onClick={() => setVisible(true)}
                >
                  <div className="text-xl text-white font-medium mx-1">
                    {company.followingIds?.length ?? 0}
                  </div>
                  <div className="text-xs text-white opacity-60 mx-1">
                    Following
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden mt-1 mx-4">
              <div className="text-white">{company.name}</div>
            </div>
            <div className="lg:grid grid-cols-2 mx-4 mt-5 lg:mt-5 mb-5">
              <div className="text-sm text-white">
                <div>{company.tagline}</div>
                <div className="mt-3">
                  {!overviewShort && <div>{company.overview}</div>}
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
                      <div>{company.overview}</div>
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
                      {company.postIds?.length ?? 0}
                    </div>
                    <div className="text-xs text-white opacity-60">Posts</div>
                  </div>
                  <div
                    className="text-center cursor-pointer px-4"
                    onClick={() => setVisible(true)}
                  >
                    <div className="text-xl text-white font-medium">
                      {company.followerIds?.length ?? 0}
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
                      {company.followingIds?.length ?? 0}
                    </div>
                    <div className="text-xs text-white opacity-60">
                      Following
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden mt-3 mb-5 px-4">
              {isEditable ? (
                <Button
                  variant="gradient-primary"
                  className="w-40 text-sm font-medium"
                  onClick={() => setEditableModal(true)}
                >
                  Edit Company
                </Button>
              ) : (
                <Button
                  variant="gradient-primary"
                  className="w-full text-sm font-medium"
                  onClick={toggleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
            <div className="flex items-center p-4 border-t border-white/[.12]">
              {company.linkedIn && (
                <div className="flex items-center cursor-pointer mr-8">
                  <Link href={company.linkedIn}>
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
              {company.twitter && (
                <div className="flex items-center cursor-pointer mr-8">
                  <Link href={company.twitter}>
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
              {company.website && (
                <div className="flex items-center cursor-pointer mr-8">
                  <Link href={company.website}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-white"
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
                    <Menu.Items className="z-10	absolute right-0 w-48 bg-background-popover shadow-md shadow-black rounded">
                      <div className="py-2">
                        <div
                          className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                          onClick={() => {}}
                        >
                          <Chats color="currentColor" size={24} />
                          <span className="ml-4">Message</span>
                        </div>
                        <div
                          className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                          onClick={() => {}}
                        >
                          <Share color="currentColor" size={24} />
                          <span className="ml-4">Share</span>
                        </div>
                        <div
                          className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                          onClick={() => {}}
                        >
                          <Copy color="currentColor" size={24} />
                          <span className="ml-4">Copy Link</span>
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <FollowersModal
        show={isVisible}
        onClose={() => setVisible(false)}
        followers={company.followers}
        following={company.following}
      />
      {editableModal && (
        <EditModal
          show={editableModal}
          onClose={() => setEditableModal(false)}
          company={company}
        />
      )}
      {mediaToEdit && (
        <MediaEditorModal
          mediaType={mediaToEdit}
          company={company}
          show={!!mediaToEdit}
          onClose={() => setMediaToEdit(undefined)}
        />
      )}
    </>
  );
};

export default ProfileCard;
