import { FC, useState } from "react";

import FundItem, { Fund } from "./FundItem";

interface FundsListProps {
  funds: Fund[];
  showImages?: boolean;
}

const FundsList: FC<FundsListProps> = ({
  funds,
  showImages = true,
}: FundsListProps) => {
  return (
    <>
      <div className="text-white mt-8 mb-2 ml-2 font-medium">Funds</div>
      {funds.map((fund, index) => (
        <div key={index} className="mb-4">
          <FundItem fund={fund} showImages={false} />
        </div>
      ))}
    </>
  );
};

export default FundsList;
