import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DotsThreeOutlineVertical,
  Share,
  LinkedinLogo,
  TwitterLogo,
  Globe,
  Chats,
  Copy,
} from "phosphor-react";
import { Menu } from "@headlessui/react";

import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";
import SearchModal from "../SearchModal";
import Avatar from "desktop/app/components/common/Avatar";

import { useFollowCompany } from "mobile/src/graphql/mutation/account";
import { useAccount } from "mobile/src/graphql/query/account";
import type { Company } from "backend/graphql/companies.graphql";
import type { User } from "backend/graphql/users.graphql";

interface AccountProps {
  account: Company;
  members: User[];
}

const Profile: FC<AccountProps> = ({ account, members }) => {
  const [isVisible, setVisible] = useState(false);
  const { data: accountData } = useAccount({ fetchPolicy: "cache-only " });
  const [followCompany] = useFollowCompany();

  const isFollowing = accountData?.account?.companyFollowingIds?.includes(
    account._id
  );

  const toggleFollowCompany = async (
    id: string,
    follow: boolean
  ): Promise<void> => {
    try {
      const { data } = await followCompany({
        variables: { follow, companyId: id },
        refetchQueries: ["Account"],
      });

      if (!data?.followCompany) {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className="relative mb-2">
        <Card className="border-0 p-0 rounded-none md:rounded-2xl">
          <div className="w-full h-32 relative">
            <Image
              loader={() =>
                `${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${account.background?.url}`
              }
              src={`${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${account.background?.url}`}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div
            className={`flex flex-col  items-baseline justify-between px-4
            pt-4 -mt-12 md:flex-row md:items-center`}
          >
            <div className="flex items-center">
              <div
                className={`w-24 h-24 flex justify-center relative shadow-2xl
                shadow-black`}
              >
                <Avatar src={account.avatar} shape="square" size={96} />
              </div>
              <div className="ml-5 mt-3">
                <div className="flex items-center">
                  <div className="text-white">{account.name}</div>
                </div>
              </div>
            </div>
            <Button
              variant="gradient-primary"
              className={`w-full h-10	mt-8 uppercase py-0 md:w-44 uppercase
                font-medium tracking-wider`}
              onClick={() => toggleFollowCompany(account._id, !isFollowing)}
            >
              {isFollowing ? "unfollow" : "follow"}
            </Button>
          </div>

          <div className="flex items-center flex-col-reverse md:flex-row my-4">
            <div className="text-sm text-white opacity-80 px-4 w-full">
              <p>{account.tagline}</p>
              <p className="mt-4">{account.overview}</p>
            </div>
            <div
              className={`w-auto mx-4 my-4 flex flex-row divide-x divide-white
              divide-opacity-40 flex-shrink-0 self-end`}
            >
              <div className="text-center px-4">
                <div className="text-xl font-medium leading-none">
                  {account.postIds?.length ?? 0}
                </div>
                <div className="text-xs text-white opacity-60 tracking-wider leading-none mt-1">
                  Posts
                </div>
              </div>
              <div
                className="text-center cursor-pointer px-4"
                onClick={() => setVisible(true)}
              >
                <div className="text-xl font-medium leading-none">
                  {account.followerIds?.length ?? 0}
                </div>
                <div className="text-xs text-white opacity-60 tracking-wider leading-none mt-1">
                  Followers
                </div>
              </div>
              <div
                className="text-center cursor-pointer px-4"
                onClick={() => setVisible(true)}
              >
                <div className="text-xl font-medium leading-none">
                  {account.followingIds?.length ?? 0}
                </div>
                <div className="text-xs text-white opacity-60 tracking-wider leading-none mt-1">
                  Following
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center p-4 border-t border-white/[.12]">
            <div className="flex items-center cursor-pointer mr-4">
              <a
                href={account.linkedIn ?? "http://www.linkedin.com"}
                className="flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinLogo size={24} weight="fill" />
                <div className="text-primary ml-2 hidden md:block text-sm">
                  Linkedin
                </div>
              </a>
            </div>
            <div className="flex items-center cursor-pointer mr-4">
              <a
                href={account.twitter ?? "http://www.twitter.com"}
                className="flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterLogo size={24} weight="fill" />
                <div className="text-primary ml-2 hidden md:block text-sm">
                  Twitter
                </div>
              </a>
            </div>
            {account.website && (
              <div className="flex items-center cursor-pointer">
                <a
                  href={account.website}
                  className="flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe size={24} weight="fill" className="hidden md:block" />
                  <div className="text-primary ml-2 text-sm">Website</div>
                </a>
              </div>
            )}
          </div>
        </Card>
        <div className="ml-auto flex items-center absolute right-4 bottom-2">
          <Menu as="div" className="relative">
            <Menu.Button>
              <DotsThreeOutlineVertical size={24} className="opacity-60" />
            </Menu.Button>
            <Menu.Items
              className={`z-10	absolute right-0 w-64
              bg-surface-light10 shadow-md shadow-black rounded`}
            >
              <Menu.Item>
                <div className="divide-y border-white/[.12] divide-inherit pb-2">
                  <div className="flex items-center p-4">
                    <Button variant="text" className="py-0">
                      <Chats size={24} />
                      <span className="ml-4">Message</span>
                    </Button>
                  </div>
                  <div className="flex items-center p-4">
                    <Button variant="text" className="py-0">
                      <Share size={24} color="#00AAE0" />
                      <span className="ml-4">Share</span>
                    </Button>
                  </div>
                  <div className="flex items-center p-4">
                    <Button variant="text" className="py-0">
                      <Copy size={24} color="#00AAE0" />
                      <span className="ml-4">Copy Link</span>
                    </Button>
                  </div>
                </div>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <SearchModal
        show={isVisible}
        onClose={() => setVisible(false)}
        account={account}
      />
    </>
  );
};

export default Profile;
