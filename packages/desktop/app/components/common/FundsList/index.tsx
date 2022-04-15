import { FC, useState } from "react";

import FundItem, { Fund } from "./FundItem";

interface FundsListProps {
  funds: Fund[];
  type: string;
}

const FundsList: FC<FundsListProps> = ({ funds, type }: FundsListProps) => {
  return (
    <>
      <div className="text-white my-4 ml-4 md:ml-0">Funds</div>
      {funds.map((fund, index) => (
        <div key={index} className="my-4">
          <FundItem fund={fund} type={type} />
        </div>
      ))}
    </>
  );
};

export default FundsList;
