import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share, Star } from "phosphor-react";
import { useAccount } from "shared/graphql/query/account";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";
import { useFollowUser } from "shared/graphql/mutation/account";
import { useFollowCompany } from "shared/graphql/mutation/account";
import { Fund } from "shared/graphql/query/marketplace/useFunds";
import Avatar from "desktop/app/components/common/Avatar";
import Button from "desktop/app/components/common/Button";
import Card from "desktop/app/components/common/Card";

export interface FundCardProps {
  fund: Fund;
  showImages?: boolean;
  profileType?: "manager" | "company";
}

const FundCard: FC<FundCardProps> = ({
  fund,
  showImages = true,
  profileType,
}: FundCardProps) => {
  const { data: { account } = {} } = useAccount();
  const [followUser] = useFollowUser();
  const [followCompany] = useFollowCompany();

  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  const isFollowing =
    account?.followingIds?.includes(fund.manager._id) ?? false;
  const isMyFund = account?._id == fund.manager._id;
  const isFollowingCompany =
    account?.companyFollowingIds?.includes(fund.company._id) ?? false;
  const toggleFollowingUser = async (userId: string) => {
    try {
      await followUser({
        variables: { follow: !isFollowing, userId },
        refetchQueries: ["Account"],
      });
    } catch (err) {}
  };

  const toggleFollowCompany = async (companyId: string) => {
    try {
      await followCompany({
        variables: { follow: !isFollowingCompany, companyId: companyId },
        refetchQueries: ["Account"],
      });
    } catch (err) {}
  };

  return (
    <>
      <Card className="hidden lg:block rounded-xl p-0 border-0">
        <div className="flex flex-row bg-secondary/[.27]">
          {showImages && (
            <div className="flex-shrink-0 w-72 h-72 bg-white relative">
              {fund.company?.background?.url && (
                <Image
                  loader={() =>
                    `${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund?.company?.background?.url}`
                  }
                  src={`${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund?.company?.background?.url}`}
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
                <div className="w-24 h-24 rounded-b relative overflow-hidden mr-4">
                  <Link href={`/company/${fund.company._id}`}>
                    <a>
                      <Avatar user={fund.company} shape="square" size={96} />
                    </a>
                  </Link>
                </div>
              )}
              <div
                className={`self-center flex-grow mr-4 ${
                  !showImages ? "mt-3" : ""
                }`}
              >
                <Link href={`/company/${fund.company._id}`}>
                  <a>
                    <div className="text-xl text-white font-medium">
                      {fund.name}
                    </div>
                    <div className="text-primary">{fund.company.name}</div>
                  </a>
                </Link>
              </div>
              <div className="self-start flex items-center mt-5">
                <div className="w-3 h-3 bg-success rounded-full" />
                <div className="text-xs text-success ml-1">{fund.status}</div>
              </div>
            </div>
            {fund.highlights && (
              <div className="min-h-0 flex-grow text-sm text-white py-3 flex">
                <ul className="self-center list-disc ml-4">
                  {fund.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

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
          {profileType === "manager" ? (
            <div className="w-64 flex-shrink-0 flex flex-col items-center p-4">
              <Link href={`/company/${fund.company._id}`}>
                <a>
                  <Avatar user={fund.company} size={128} shape="square" />
                </a>
              </Link>
              <Link href={`/company/${fund.company._id}`}>
                <a className="text-sm text-white mt-2 tracking-wide">
                  {fund.company.name}
                </a>
              </Link>
              <div className="text-xs text-white opacity-60 tracking-wider">
                {fund.company.followerIds?.length ?? 0} Followers
                {" • "}
                {fund.company.postIds?.length ?? 0} Posts
              </div>
              <div className="text-center min-h-0 flex-grow mb-2">
                <div className={isMyFund ? "invisible" : ""}>
                  <Button
                    variant="text"
                    className="text-sm text-primary tracking-normal font-normal"
                    onClick={() => toggleFollowCompany(fund.company._id)}
                  >
                    {isFollowingCompany ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              </div>
              <Link href={`/funds/${fund._id}`}>
                <a>
                  <Button
                    variant="gradient-primary"
                    className="w-full text-sm font-medium"
                  >
                    View Fund Details
                  </Button>
                </a>
              </Link>
            </div>
          ) : (
            <div className="w-64 flex-shrink-0 flex flex-col items-center p-4">
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
                <div className={isMyFund ? "invisible" : ""}>
                  <Button
                    variant="text"
                    className="text-sm text-primary tracking-normal font-normal"
                    onClick={() => toggleFollowingUser(fund.manager._id)}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              </div>
              <Link href={`/funds/${fund._id}`}>
                <a>
                  <Button
                    variant="gradient-primary"
                    className="w-full text-sm font-medium"
                  >
                    View Fund Details
                  </Button>
                </a>
              </Link>
            </div>
          )}
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
      </Card>
      <Card className="block lg:hidden rounded-none p-0">
        <div className="h-20 bg-white relative">
          {fund.company?.background?.url && (
            <Image
              loader={() =>
                `${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund?.company?.background?.url}`
              }
              src={`${process.env.NEXT_PUBLIC_BACKGROUND_URL}/${fund?.company?.background?.url}`}
              alt=""
              layout="fill"
              className="object-cover"
              unoptimized={true}
            />
          )}
        </div>
        <div className="relative px-4 pt-8 bg-secondary/[.27]">
          <Link href={`/company/${fund.company._id}`}>
            <a>
              <Avatar
                user={fund.company}
                shape="square"
                size={64}
                className="w-16 h-16 relative overflow-hidden -mt-16"
              />
            </a>
          </Link>
          <div className="flex items-center justify-end -mt-5">
            <div className="w-3 h-3 bg-success rounded-full" />
            <div className="text-xs text-success ml-1">{fund.status}</div>
          </div>
          <div className="text-white mt-2">{fund.name}</div>
          <Link href={`/company/${fund.company._id}`}>
            <a>
              <div className="text-sm text-primary">{fund.company.name}</div>
            </a>
          </Link>
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
          {profileType === "manager" ? (
            <div className="border-t border-white/[.12] py-4">
              <div className="flex items-center">
                <div className="w-12 h-12 relative flex rounded-lg overflow-hidden">
                  <Link href={`/company/${fund.company._id}`}>
                    <a>
                      <Avatar user={fund.company} shape="square" size={48} />
                    </a>
                  </Link>
                </div>
                <div className="ml-3">
                  <div className="text-sm text-white flex items-center">
                    <Link href={`/company/${fund.company._id}`}>
                      <a>
                        <div>{fund.company.name}</div>
                      </a>
                    </Link>
                    {!isMyFund && (
                      <div className="flex items-center">
                        <span className="mx-1">•</span>
                        <Button
                          variant="text"
                          className="text-primary text-xs tracking-normal font-normal py-0"
                          onClick={() => toggleFollowCompany(fund.company._id)}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white opacity-60">
                    {fund.company.followerIds?.length ?? 0} Followers
                    {" • "}
                    {fund.company.postIds?.length ?? 0} Posts
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t border-white/[.12] py-4">
              <div className="flex items-center">
                <div className="overflow-hidden">
                  {fund.manager.avatar && (
                    <Avatar user={fund.manager} size={48} />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm text-white flex items-center">
                    <div>
                      {fund.manager.firstName} {fund.manager.lastName}
                    </div>
                    {!isMyFund && (
                      <div className="flex items-center">
                        <span className="mx-1">•</span>
                        <Button
                          variant="text"
                          className="text-primary text-xs tracking-normal font-normal py-0"
                          onClick={() => toggleFollowingUser(fund.manager._id)}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white opacity-60">
                    {fund.manager.followerIds?.length ?? 0} Followers
                    {" • "}
                    {fund.manager.postIds?.length ?? 0} Posts
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <Link href={`/funds/${fund._id}`}>
              <a className="w-full">
                <Button
                  variant="gradient-primary"
                  className="w-full flex-grow text-sm font-medium"
                >
                  View Fund Details
                </Button>
              </a>
            </Link>
            <Button variant="text" className="ml-3">
              <Share color="white" weight="light" size={20} />
            </Button>
            <Button variant="text" className="ml-3" onClick={toggleWatch}>
              <Star
                className={isWatching ? "text-primary-medium" : "text-white"}
                color="currentColor"
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

export default FundCard;
