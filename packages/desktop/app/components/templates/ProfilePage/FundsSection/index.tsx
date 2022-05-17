import { FC } from "react";
import { useManagedFunds } from "shared/graphql/query/user/useManagedFunds";
import FundCard from "../../../modules/funds/FundCard";

interface FundsSectionProps {
  userId: string;
  showNoFundsLabel: boolean;
}

const FundsSection: FC<FundsSectionProps> = ({ userId, showNoFundsLabel }) => {
  const { data: { userProfile } = {} } = useManagedFunds(userId);
  if (!userProfile) {
    return <></>;
  }
  if (userProfile.managedFunds.length == 0) {
    if (showNoFundsLabel) {
      return (
        <>
          <div className="text-sm text-white opacity-60 py-4">
            You don’t have any featured posts, yet.
          </div>
        </>
      );
    } else {
      return <></>;
    }
  }
  return (
    <>
      <div className="py-5">
        {userProfile.managedFunds.map((fund) => (
          <div key={fund._id} className="mb-5">
            <FundCard
              fund={fund}
              showImages={false}
              profileType="manager"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default FundsSection;