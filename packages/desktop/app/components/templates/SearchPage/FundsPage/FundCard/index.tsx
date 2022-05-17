import React, { FC } from "react";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";
import Avatar from "../../../../common/Avatar";
import Link from "next/link";
import Button from "../../../../common/Button";
import { Star } from "phosphor-react";
import { useWatchFund } from "shared/graphql/mutation/funds/useWatchFund";

interface FundCardProps {
  fund: GlobalSearchData["globalSearch"]["funds"][number];
}

const FundCard: FC<FundCardProps> = ({ fund }) => {
  const { isWatching, toggleWatch } = useWatchFund(fund._id);
  return (
    <>
      <div className="hidden md:block bg-background">
        <div className="bg-secondary/[.27] border border-white/[.12] rounded-t">
          <div className="flex px-3 py-4">
            <Link href={`/company/${fund.company._id}`}>
              <a>
                <Avatar
                  user={fund.company}
                  size={64}
                  shape="square"
                  className="shadow-none"
                />
              </a>
            </Link>
            <div className="flex-grow mx-4">
              <div className="text-xl text-white font-medium">
                {fund.name}
              </div>
              <div>
                <Link href={`/company/${fund.company._id}`}>
                  <a className="text-primary">
                    {fund.company.name}
                  </a>
                </Link>
              </div>
              <div className="text-xs text-white mt-1">
                <span>Hedge Fund</span>
                <span className="opacity-60"> • </span>
                <span>L/S Equity</span>
                <span className="opacity-60"> • </span>
                <span>$500k min</span>
              </div>
            </div>
            <div className="self-start flex items-center">
              <div className="w-3 h-3 bg-success rounded-full" />
              <div className="text-xs text-success ml-1">{fund.status}</div>
            </div>
          </div>
        </div>
        <div className="bg-secondary/[.12] rounded-b border border-white/[.12]">
          <div className="flex items-center px-3 py-3">
            <Avatar user={fund.manager} size={40} />
            <div className="text-sm text-white ml-3">
              {fund.manager.firstName} {fund.manager.lastName}
            </div>
            <div className="ml-auto">
              <Link href={`/funds/${fund._id}`}>
                <a>
                  <Button
                    variant="gradient-primary"
                    className="text-sm font-medium py-2"
                  >
                    View Fund Details
                  </Button>
                </a>
              </Link>
            </div>
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
      </div>
      <div className="block md:hidden p-4">
        <div className="flex items-center">
          <div>
            <Link href={`/company/${fund.company._id}`}>
              <a>
                <Avatar
                  user={fund.company}
                  size={64}
                  shape="square"
                  className="shadow-none rounded-lg"
                />
              </a>
            </Link>
          </div>
          <div className="flex-grow ml-4 mr-4">
            <Link href={`/funds/${fund._id}`}>
              <a className="text-white font-medium">
                {fund.name}
              </a>
            </Link>
            <div className="text-xs text-gray-400">
              {fund.company.name}
            </div>
          </div>
          <Button variant="text" onClick={toggleWatch}>
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
