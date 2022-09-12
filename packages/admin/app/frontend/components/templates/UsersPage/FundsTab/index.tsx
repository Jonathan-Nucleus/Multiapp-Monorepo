import { FC, useState } from "react";
import { Star } from "phosphor-react";

import FundsHeader from "./FundsHeader";
import FundsListTile from "./FundsListTile";

import { User } from "admin/app/frontend/graphql/fragments/user";
import { useFunds } from "../../../../graphql/queries/users/useFunds";

interface FundsTabProps {
  user: User;
}

const FundsTab: FC<FundsTabProps> = ({ user }) => {
  const { data: { user: fundsData } = {} } = useFunds(user._id);

  const fundOptions = ["Watchlisted", "Managed"] as const;
  const [fundType, setFundType] =
    useState<typeof fundOptions[number]>("Watchlisted");

  const { watchlist = [], managedFunds = [] } = fundsData || {};
  const funds = fundType === "Watchlisted" ? watchlist : managedFunds;

  return (
    <>
      <FundsHeader
        options={fundOptions}
        selectedOption={fundType}
        onOptionSelected={(option) => setFundType(option)}
      />
      {funds.map((fund) => {
        return (
          <FundsListTile
            key={fund._id}
            fund={fund}
            fundInfo={
              fundType === "Watchlisted" ? (
                <>
                  <p className="text-black">Status</p>
                  <p className="text-gray-600 text-sm">Status Details</p>
                </>
              ) : (
                <Star size={25} color={"#666"} />
              )
            }
            onPressed={() => {}}
          />
        );
      })}
    </>
  );
};

export default FundsTab;
