import { FC, useState } from "react";
import { FundDetails } from "shared/graphql/query/marketplace/useFund";
import Link from "next/link";
import Avatar from "../../../../common/Avatar";
import Button from "../../../../common/Button";
import ContactSpecialist from "../../../../modules/funds/ContactSpecialist";
import { AssetClasses } from "backend/graphql/enumerations.graphql";
import Card from "../../../../common/Card";
import { useFollowUser } from "shared/graphql/mutation/account/useFollowUser";

const dollarFormatter = Intl.NumberFormat("en", { notation: "compact" });

interface ManagerCardProps {
  fund: FundDetails;
}

const ManagerCard: FC<ManagerCardProps> = ({ fund }) => {
  const [showContactSpecialist, setShowContactSpecialist] = useState(false);
  const { isFollowing, toggleFollow } = useFollowUser(fund.manager._id);
  return (
    <Card className="p-0 rounded-lg">
      <div className="border-white/[.12] divide-y divide-inherit">
        <div className="p-5">
          <div className="flex flex-col items-center p-5 pt-1">
            <Link href={`/profile/${fund.manager._id}`}>
              <a>
                <Avatar user={fund.manager} size={128} />
              </a>
            </Link>
            <div className="flex items-center mt-2">
              <Link href={`/profile/${fund.manager._id}`}>
                <a className="text-sm text-white tracking-wider">
                  {fund.manager.firstName} {fund.manager.lastName}
                </a>
              </Link>
              <div className="text-white opacity-60 mx-2">•</div>
              <div>
                <Button
                  variant="text"
                  className="text-sm text-primary font-normal tracking-wider py-0"
                  onClick={toggleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </div>
            <div className="text-xs text-white opacity-60 tracking-wide">
              {fund.manager.followerIds?.length ?? 0} Followers
              {" • "}
              {fund.manager.postIds?.length ?? 0} Posts
            </div>
          </div>
          <div className="my-2">
            <Button
              variant="gradient-primary"
              className="w-full font-medium h-12"
              onClick={() => setShowContactSpecialist(true)}
            >
              Contact Specialist
            </Button>
            {showContactSpecialist && (
              <ContactSpecialist
                show={showContactSpecialist}
                onClose={() => setShowContactSpecialist(false)}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="p-4">
            <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
              Asset Class
            </div>
            <div className="text-white">
              {AssetClasses.find(
                (assetClass) => assetClass.value === fund.class
              )?.label ?? ""}
            </div>
          </div>
          <div className="p-4">
            <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
              Strategy
            </div>
            <div className="text-white">{fund.strategy}</div>
          </div>
        </div>
        {fund.aum ? (
          <div className="grid grid-cols-2">
            <div className="p-4">
              <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
                Fund AUM
              </div>
              <div className="text-white">
                ${dollarFormatter.format(fund.aum)}
              </div>
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-2">
          <div className="py-4 pl-4">
            <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
              Minimum Investment
            </div>
            <div className="text-white">
              ${dollarFormatter.format(fund.min)}
            </div>
          </div>
          <div className="p-4">
            <div className="text-tiny tracking-widest text-white opacity-60 uppercase mb-1">
              Lockup Period
            </div>
            <div className="text-white">{fund.lockup}</div>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div className="p-4">
            <div className="text-tiny tracking-widest text-white/[0.6] uppercase mb-1">
              liquidity
            </div>
            <div className="text-white font-light">{fund.liquidity}</div>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div className="p-4">
            <div className="text-xs text-white/[0.6] font-light tracking-wider">
              {fund.fees.map((fee) => `${fee.label}: ${fee.value}`).join(" • ")}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ManagerCard;
