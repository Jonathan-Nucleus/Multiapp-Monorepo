import React, { FC } from "react";
import { Share, Star } from "phosphor-react";
import Image from "next/image";

import Card from "../Card";
import { FetchFundsData } from "../../../graphql/queries/marketplace";
import Button from "../Button";

export type Fund = Exclude<FetchFundsData["funds"], undefined>[number];

interface FundItemProps {
  fund: Fund;
  type: string;
}

const FundItem: FC<FundItemProps> = ({ fund, type }: FundItemProps) => {
  return (
    <>
      <Card className="hidden lg:block p-0 rounded-2xl">
        <div className="flex flex-row bg-secondary/[.27]">
          <div className="flex flex-col flex-grow px-5">
            <div className="flex">
              <div className="self-center flex-grow mx-4">
                <div className="text-xl text-white font-medium">
                  {fund.name}
                </div>
                <div className="text-primary">{fund.company.name}</div>
              </div>
            </div>
            <div className="min-h-0 flex-grow text-sm text-white py-3">
              {fund.overview}
            </div>
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
          </div>
          <div className="bg-white/[.12] w-px my-5" />
          {type === "company" ? (
            <div className="w-60 flex-shrink-0 flex flex-col items-center p-4">
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
              <div className="text-sm text-white mt-2">
                {fund.manager.firstName} {fund.manager.lastName}
              </div>
              <div className="text-xs text-white opacity-60">
                {fund.manager.followerIds?.length ?? 0} Followers
                {" • "}
                {fund.manager.postIds?.length ?? 0} Posts
              </div>
              <div className="text-center min-h-0 flex-grow">
                <Button
                  variant="text"
                  className="text-sm text-primary tracking-normal font-normal"
                >
                  Follow
                </Button>
              </div>
              <Button
                variant="gradient-primary"
                className="w-full text-sm uppercase font-medium"
              >
                view fund details
              </Button>
            </div>
          ) : (
            <div className="w-60 flex-shrink-0 flex flex-col items-center p-4">
              <div className="w-32 h-32 relative bg-white flex rounded-lg overflow-hidden">
                <Image
                  loader={() =>
                    `${process.env.NEXT_PUBLIC_AVATAR_URL}/${fund.company?.avatar}`
                  }
                  src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${fund.company?.avatar}`}
                  alt=""
                  layout="fill"
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              <div className="text-sm text-white mt-2">{fund.company.name}</div>
              <div className="text-xs text-white opacity-60">
                {fund.company.followerIds?.length ?? 0} Followers
                {" • "}
                {fund.company.postIds?.length ?? 0} Posts
              </div>
              <div className="text-center min-h-0 flex-grow">
                <Button
                  variant="text"
                  className="text-sm text-primary tracking-normal font-normal"
                >
                  Follow
                </Button>
              </div>
              <Button
                variant="gradient-primary"
                className="w-full text-sm uppercase font-medium"
              >
                view fund details
              </Button>
            </div>
          )}
        </div>
        <div className="bg-secondary/[.12] border-t border-white/[.12]">
          <div className="flex border-white/[.12] divide-x divide-inherit">
            <div className="flex-grow grid grid-cols-4 border-white/[.12] divide-x divide-inherit">
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-white opacity-60">ASSET CLASS</div>
                <div className="text-white">Hedge Fund</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-white opacity-60">STRATEGY</div>
                <div className="text-white">L/S Equity</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-white opacity-60">AUM</div>
                <div className="text-white">$5M</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-white opacity-60">
                  MIN INVESTMENT
                </div>
                <div className="text-white">$100K</div>
              </div>
            </div>
            <div className="w-60 text-right p-2">
              <Button variant="text">
                <Share color="white" weight="light" size={20} />
              </Button>
              <Button variant="text" className="ml-2">
                <Star color="white" weight="light" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <Card className="block lg:hidden rounded-none p-0">
        <div className="relative px-4 pt-8 bg-secondary/[.27]">
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
                  >
                    FOLLOW
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
              <Star color="white" weight="light" size={20} />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default FundItem;
