import React, { FC } from "react";
import Link from "next/link";
import { Star } from "phosphor-react";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";
import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";
import { useFollowCompany } from "shared/graphql/mutation/account/useFollowCompany";
import { Fund } from "shared/graphql/query/marketplace/useFunds";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "desktop/app/components/common/Button";
import { useAccountContext } from "shared/context/Account";

import { AssetClasses } from "backend/graphql/enumerations.graphql";

export interface FundCardProps {
  fund: Fund;
  showImages?: boolean;
  profileType?: "manager" | "company";
}

const dollarFormatter = Intl.NumberFormat("en", { notation: "compact" });

const FundCard: FC<FundCardProps> = ({
  fund,
  showImages = true,
  profileType,
}: FundCardProps) => {
  const account = useAccountContext();
  const { isFollowing: isFollowingManager, toggleFollow: toggleFollowManager } =
    useFollowUser(fund.manager._id);
  const { isFollowing: isFollowingCompany, toggleFollow: toggleFollowCompany } =
    useFollowCompany(fund.company._id);
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  const isMyFund = account?._id == fund.manager._id;

  return (
    <>
      <div className="hidden lg:block border border-white/[.12] rounded-lg">
        <div className="flex bg-surface-light10">
          <div className="flex flex-col flex-grow mt-4 px-4">
            <div className="flex items-center">
              {showImages && (
                <div className="w-24 h-24 flex-shrink-0 mr-4">
                  <Link href={`/funds/${fund._id}`}>
                    <a>
                      <Avatar
                        user={fund.company}
                        className="shadow-none"
                        size={96}
                        shape="square"
                      />
                    </a>
                  </Link>
                </div>
              )}
              <div>
                <Link href={`/company/${fund.company._id}`}>
                  <a>
                    <div className="text-xl text-white font-medium">
                      {fund.name}
                    </div>
                    <div className="text-primary">{fund.company.name}</div>
                  </a>
                </Link>
              </div>
            </div>
            {fund.highlights && (
              <div className="min-h-0 flex-grow text-sm text-white mt-4">
                <ul className="list-disc ml-4">
                  {fund.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="uppercase truncate mt-2 mb-6">
              <div className="text-xs font-medium text-white/[.6]">
                {fund.tags.join(" • ")}
              </div>
            </div>
          </div>
          <div className="bg-white/[.12] w-px my-5" />
          {profileType === "manager" ? (
            <div className="w-80 flex-shrink-0 flex flex-col items-center p-4">
              <Link href={`/company/${fund.company._id}`}>
                <a>
                  <Avatar user={fund.company} size={128} shape="square" />
                </a>
              </Link>
              <Link href={`/company/${fund.company._id}`}>
                <a className="text-sm text-white text-center mt-2 tracking-wide">
                  {fund.limitedView
                    ? "View Company Profile"
                    : fund.company.name}
                </a>
              </Link>
              <div className="text-xs text-white opacity-60 tracking-wider">
                {fund.company.followerIds?.length ?? 0} Followers
                {" • "}
                {fund.company.postIds?.length ?? 0} Posts
              </div>
              <div className="text-center min-h-0 flex-grow mb-2">
                <div
                  className={
                    isMyFund || account.companyIds?.includes(fund.company._id)
                      ? "invisible"
                      : ""
                  }
                >
                  <Button
                    variant="text"
                    className="text-sm text-primary tracking-normal font-normal"
                    onClick={toggleFollowCompany}
                  >
                    {isFollowingCompany ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              </div>
              <Link href={`/funds/${fund._id}`}>
                <a className="w-full">
                  <Button
                    variant="gradient-primary"
                    className="w-full text-sm font-medium uppercase"
                  >
                    {fund.limitedView
                      ? "View Strategy Overview"
                      : "View Fund Details"}
                  </Button>
                </a>
              </Link>
            </div>
          ) : (
            <div className="w-80 flex-shrink-0 flex flex-col items-center p-4">
              <Link href={`/profile/${fund.manager._id}`}>
                <a>
                  <Avatar user={fund.manager} size={128} />
                </a>
              </Link>
              <Link href={`/profile/${fund.manager._id}`}>
                <a className="text-sm text-white mt-2 tracking-wide">
                  {fund.manager.firstName} {fund.manager.lastName}
                </a>
              </Link>
              <div className="text-xs text-white opacity-60 tracking-wider">
                {fund.manager.followerIds?.length ?? 0} Followers
                {" • "}
                {fund.manager.postIds?.length ?? 0} Posts
              </div>
              <div className="text-center min-h-0 flex-grow mb-2">
                <div
                  className={isMyFund || isFollowingManager ? "invisible" : ""}
                >
                  <Button
                    variant="text"
                    className="text-sm text-primary tracking-normal font-normal"
                    onClick={toggleFollowManager}
                  >
                    {isFollowingManager ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              </div>
              <Link href={`/funds/${fund._id}`}>
                <a className="w-full">
                  <Button
                    variant="gradient-primary"
                    className="w-full text-sm font-medium uppercase"
                  >
                    {fund.limitedView
                      ? "View Strategy Overview"
                      : "View Fund Details"}
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </div>
        <div className="border-t border-white/[.12]">
          <div className="flex border-white/[.12] divide-x divide-inherit">
            <div className="flex-grow grid grid-cols-4 border-white/[.12] divide-x divide-inherit">
              <div className="flex flex-col items-center justify-center px-2 py-2">
                <div className="text-tiny text-white text-center opacity-60 tracking-widest mb-1">
                  ASSET CLASS
                </div>
                <div className="text-white text-center">
                  {
                    AssetClasses.find(
                      (assetClass) => assetClass.value === fund.class
                    )?.label
                  }
                </div>
              </div>
              <div className="flex flex-col items-center justify-center px-2 py-2">
                <div className="text-tiny text-white text-center opacity-60 tracking-widest mb-1">
                  STRATEGY
                </div>
                <div className="text-white text-center">{fund.strategy}</div>
              </div>
              <div className="flex flex-col items-center justify-center px-2 py-2">
                <div className="text-tiny text-white text-center opacity-60 tracking-widest mb-1">
                  AUM
                </div>
                <div className="text-white text-center">
                  {`$${dollarFormatter.format(fund.aum)}`}
                </div>
              </div>
              <div>
                <div
                  className={`flex flex-col items-center justify-center px-2 py-2 ${
                    fund.limitedView ? "invisible" : ""
                  }`}
                >
                  <div className="text-tiny text-white text-center opacity-60 tracking-widest mb-1">
                    MIN INVESTMENT
                  </div>
                  <div className="text-white">
                    {`$${dollarFormatter.format(fund.min)}`}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-80 text-right flex items-center justify-between px-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success rounded-full" />
                <div className="text-xs text-success ml-1">{fund.status}</div>
              </div>
              <Button variant="text" className="ml-2" onClick={toggleWatch}>
                <Star
                  className={isWatching ? "text-primary-medium" : "text-white"}
                  color="currentColor"
                  weight={isWatching ? "fill" : "light"}
                  size={20}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="block lg:hidden border border-white/[.12]">
        <div className="flex items-center py-3">
          <Link href={`/company/${fund.company._id}`}>
            <a className="ml-4">
              <Avatar user={fund.company} shape="square" size={64} />
            </a>
          </Link>
          <Link href={`/company/${fund.company._id}`}>
            <a className="ml-3">
              <div className="text-sm text-white font-medium">{fund.name}</div>
            </a>
          </Link>
          <div className="self-start ml-auto mr-2">
            <div className="flex items-center bg-success/[.3] rounded-full px-2 py-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <div className="text-tiny text-success ml-1">{fund.status}</div>
            </div>
          </div>
        </div>
        <div
          className={`grid ${
            fund.limitedView ? "grid-cols-2" : "grid-cols-3"
          } border-y border-white/[.12] divide-x divide-inherit`}
        >
          <div className="flex flex-col items-center justify-center px-2 py-2">
            <div className="text-tiny text-white opacity-60 mb-1">
              ASSET CLASS
            </div>
            <div className="text-xs text-white text-center">
              {
                AssetClasses.find(
                  (assetClass) => assetClass.value === fund.class
                )?.label
              }
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-2 py-2">
            <div className="text-tiny text-white opacity-60 mb-1">STRATEGY</div>
            <div className="text-xs text-white text-center">
              {fund.strategy}
            </div>
          </div>
          {!fund.limitedView && (
            <div className="flex flex-col items-center justify-center px-2 py-2">
              <div className="text-tiny text-white opacity-60 mb-1">
                MINIMUM
              </div>
              <div className="text-xs text-white text-center">
                {`$${dollarFormatter.format(fund.min)}`}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center mt-4 px-5">
          <Link href={`/profile/${isMyFund ? "me" : fund.manager._id}`}>
            <a>
              <Avatar user={fund.manager} size={24} />
            </a>
          </Link>
          <div className="text-xs text-white ml-2">
            <Link href={`/profile/${isMyFund ? "me" : fund.manager._id}`}>
              <a>
                {fund.manager.firstName} {fund.manager.lastName}
              </a>
            </Link>
          </div>
        </div>
        <div className="text-xs text-white ml-5 mr-3 mt-4">{fund.overview}</div>
        <div className="flex items-center mx-5 my-4">
          <div className="flex-grow">
            <Link href={`/funds/${fund._id}`}>
              <a>
                <Button
                  variant="outline-primary"
                  className="w-full text-xs text-white font-bold uppercase"
                >
                  {fund.limitedView
                    ? "View Strategy Overview"
                    : "View Fund Details"}
                </Button>
              </a>
            </Link>
          </div>
          <Button variant="text" className="ml-5" onClick={toggleWatch}>
            <Star
              className={isWatching ? "text-primary-medium" : "text-white"}
              color="currentColor"
              weight={isWatching ? "fill" : "light"}
              size={20}
            />
          </Button>
        </div>
      </div>
    </>
  );
};

export default FundCard;
