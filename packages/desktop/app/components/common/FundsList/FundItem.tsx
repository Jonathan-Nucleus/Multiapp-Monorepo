import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share, Star } from "phosphor-react";

import type { User } from "backend/graphql/users.graphql";
import { useAccount } from "desktop/app/graphql/queries";
import { Fund } from "mobile/src/graphql/query/marketplace";
import { useWatchFund } from "mobile/src/graphql/mutation/funds";
import { useFollowUser } from "desktop/app/graphql/mutations/profiles";

import Button from "desktop/app/components/common/Button";
import Card from "desktop/app/components/common/Card";

import { PINK } from "shared/src/colors";

interface FundItemProps {
  fund: Fund;
  showImages?: boolean;
}

const FundItem: FC<FundItemProps> = ({
  fund,
  showImages = true,
}: FundItemProps) => {
  const {
    data: userData,
    loading: userLoading,
    refetch,
  } = useAccount({ fetchPolicy: "cache-only" });

  const account: User = userData?.account;
  const [followUser] = useFollowUser();
  const [watchFund] = useWatchFund();

  const isFollower =
    userData?.account?.followingIds?.includes(fund.manager._id) ?? false;
  const isWatching =
    userData?.account?.watchlistIds?.includes(fund._id) ?? false;

  const toggleFollowingUser = async (
    id: string,
    follow: boolean
  ): Promise<void> => {
    try {
      const { data } = await followUser({
        variables: { follow: follow, userId: id },
      });
      data?.followUser ? refetch() : console.log("err", data);
    } catch (err) {
      console.log("err", err);
    }
  };

  const toggleWatchFund = async (id: string, watch: boolean): Promise<void> => {
    try {
      const { data } = await watchFund({
        variables: { watch, fundId: id },
        refetchQueries: ["Account"],
      });

      if (!data?.watchFund) {
        console.log("err", data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <Card className="hidden lg:block rounded-xl p-0">
        <div className="flex flex-row bg-secondary/[.27]">
          {showImages && (
            <div className="flex-shrink-0 w-72 h-72 bg-white relative">
              {fund.background && (
                <Image
                  loader={() =>
                    `${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund.background.url}`
                  }
                  src={`${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund.background.url}`}
                  alt=""
                  layout="fill"
                  className="object-cover"
                  unoptimized={true}
                />
              )}
            </div>
          )}
          <div className="flex flex-col flex-grow px-5">
            <div className="flex">
              {showImages && (
                <div className="w-24 h-24 bg-purple-secondary rounded-b relative mr-4">
                  {fund?.company?.background && (
                    <Image
                      loader={() =>
                        `${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund?.company?.background.url}`
                      }
                      src={`${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund?.company?.background.url}`}
                      alt=""
                      layout="fill"
                      className="object-cover"
                      unoptimized={true}
                    />
                  )}
                </div>
              )}
              <div
                className={`self-center flex-grow mr-4 ${
                  !showImages ? "mt-3" : ""
                }`}
              >
                <div className="text-xl text-white font-medium">
                  {fund.name}
                </div>
                <div className="text-primary">{fund.company.name}</div>
              </div>
              <div className="self-start flex items-center mt-5">
                <div className="w-3 h-3 bg-success rounded-full" />
                <div className="text-xs text-success ml-1">{fund.status}</div>
              </div>
            </div>
            <div className="min-h-0 flex-grow text-sm text-white py-3 flex">
              <ul className="self-center list-disc ml-4">
                {fund.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap -mx-1 py-2">
              {fund.tags.map((tag) => (
                <div
                  key={tag}
                  className={`bg-white/[.12] text-xs text-white font-medium
                    rounded-full uppercase m-1 px-3 py-1 tracking-widest`}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[.12] w-px my-5" />
          <div className="w-64 flex-shrink-0 flex flex-col items-center p-4">
            <div className="w-32 h-32 relative bg-white flex rounded-full overflow-hidden">
              {fund.manager.avatar && (
                <Image
                  loader={() =>
                    `${process.env.NEXT_PUBLIC_AVATAR_URL}/${fund.manager.avatar}`
                  }
                  src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${fund.manager.avatar}`}
                  alt=""
                  layout="fill"
                  className="object-cover"
                  unoptimized={true}
                />
              )}
            </div>
            <div className="text-sm text-white mt-2 tracking-wide">
              {fund.manager.firstName} {fund.manager.lastName}
            </div>
            <div className="text-xs text-white opacity-60 tracking-wider">
              {fund.manager.followerIds?.length ?? 0} Followers
              {" • "}
              {fund.manager.postIds?.length ?? 0} Posts
            </div>
            <div className="text-center min-h-0 flex-grow mb-2">
              <Button
                variant="text"
                className="text-sm text-primary tracking-normal font-normal"
                onClick={() =>
                  toggleFollowingUser(fund.manager._id, !isFollower)
                }
              >
                {isFollower ? "UNFOLLOW" : "FOLLOW"}
              </Button>
            </div>
            <Link href={`/funds/${fund._id}`}>
              <Button
                variant="gradient-primary"
                className="w-full text-sm uppercase font-medium"
              >
                view fund details
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-secondary/[.12] border-t border-white/[.12]">
          <div className="flex border-white/[.12] divide-x divide-inherit">
            <div className="flex-grow grid grid-cols-4 border-white/[.12] divide-x divide-inherit">
              <div className="flex flex-col items-center justify-center py-2">
                <div className="text-tiny text-white opacity-60 tracking-widest mb-1">
                  ASSET CLASS
                </div>
                <div className="text-white">Hedge Fund</div>
              </div>
              <div className="flex flex-col items-center justify-center py-2">
                <div className="text-tiny text-white opacity-60 tracking-widest mb-1">
                  STRATEGY
                </div>
                <div className="text-white">L/S Equity</div>
              </div>
              <div className="flex flex-col items-center justify-center py-2">
                <div className="text-tiny text-white opacity-60 tracking-widest mb-1">
                  AUM
                </div>
                <div className="text-white">$5M</div>
              </div>
              <div className="flex flex-col items-center justify-center py-2">
                <div className="text-tiny text-white opacity-60 tracking-widest mb-1">
                  MIN INVESTMENT
                </div>
                <div className="text-white">$100K</div>
              </div>
            </div>
            <div className="w-64 text-right p-2 flex align-center justify-end">
              <Button variant="text">
                <Share color="white" weight="light" size={20} />
              </Button>
              <Button
                variant="text"
                className="ml-2"
                onClick={() => toggleWatchFund(fund._id, !isWatching)}
              >
                <Star
                  color={isWatching ? PINK : "white"}
                  weight={isWatching ? "fill" : "light"}
                  size={20}
                />
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <Card className="block lg:hidden rounded-none p-0">
        <div className="h-20 bg-white relative">
          {fund.background && (
            <Image
              loader={() => fund.background.url}
              src={fund.background.url}
              alt=""
              layout="fill"
              className="object-cover"
              unoptimized={true}
            />
          )}
        </div>
        <div className="relative px-4 pt-8 bg-secondary/[.27]">
          <div className="w-16 h-16 bg-purple-secondary rounded relative -mt-16">
            {fund.background && (
              <Image
                loader={() => fund.background.url}
                src={fund.background.url}
                alt=""
                layout="fill"
                className="object-cover"
                unoptimized={true}
              />
            )}
          </div>
          <div className="flex items-center justify-end -mt-5">
            <div className="w-3 h-3 bg-success rounded-full" />
            <div className="text-xs text-success ml-1">{fund.status}</div>
          </div>
          <div className="text-white mt-2">{fund.name}</div>
          <div className="text-sm text-primary">{fund.company.name}</div>
          <div className="text-sm text-white py-3">{fund.overview}</div>
          <div className="flex flex-wrap -mx-1 py-2">
            {fund.tags.map((tag) => (
              <div
                key={tag}
                className="bg-white/[.12] text-xs text-white font-medium rounded-full uppercase m-1 px-3 py-1"
              >
                {tag}
              </div>
            ))}
          </div>
          <div className="border-t border-white/[.12] py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 relative bg-white flex rounded-full overflow-hidden">
                {fund.manager.avatar && (
                  <Image
                    loader={() =>
                      `${process.env.NEXT_PUBLIC_AVATAR_URL}/${fund.manager.avatar}`
                    }
                    src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${fund.manager.avatar}`}
                    alt=""
                    layout="fill"
                    className="object-cover"
                    unoptimized={true}
                  />
                )}
              </div>
              <div className="ml-3">
                <div className="text-sm text-white flex items-center">
                  {fund.manager.firstName} {fund.manager.lastName}
                  <span className="mx-1">•</span>
                  <Button
                    variant="text"
                    className="text-primary text-xs tracking-normal font-normal py-0"
                    onClick={() =>
                      toggleFollowingUser(fund.manager._id, !isFollower)
                    }
                  >
                    {isFollower ? "UNFOLLOW" : "FOLLOW"}
                  </Button>
                </div>
                <div className="text-xs text-white opacity-60">
                  {fund.manager.followerIds?.length ?? 0} Followers
                  {" • "}
                  {fund.manager.postIds?.length ?? 0} Posts
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-secondary/[.12]">
          <div className="grid grid-cols-3 border-y border-white/[.12] divide-x divide-inherit">
            <div className="flex flex-col items-center justify-center py-2">
              <div className="text-xs text-white opacity-60">ASSET CLASS</div>
              <div className="text-white">Hedge Fund</div>
            </div>
            <div className="flex flex-col items-center justify-center py-2">
              <div className="text-xs text-white opacity-60">STRATEGY</div>
              <div className="text-white">L/S Equity</div>
            </div>
            <div className="flex flex-col items-center justify-center py-2">
              <div className="text-xs text-white opacity-60">AUM</div>
              <div className="text-white">$5M</div>
            </div>
          </div>
          <div className="flex items-center px-4 py-3">
            <Button
              variant="gradient-primary"
              className="flex-grow text-sm uppercase font-medium"
            >
              view fund details
            </Button>
            <Button variant="text" className="ml-3">
              <Star
                color="white"
                weight={isWatching ? "fill" : "light"}
                size={20}
              />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default FundItem;
