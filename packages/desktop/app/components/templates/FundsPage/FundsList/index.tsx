import { FC } from "react";
import FundItem, { Fund } from "./FundItem";

interface FundsListProps {
  funds: Fund[];
}

const FundsList: FC<FundsListProps> = ({ funds }: FundsListProps) => {
  return (
    <>
      {funds!.map((fund, index) => (
        <div key={index} className="mb-6">
          <FundItem fund={fund} />
        </div>
      ))}
    </>
  );
};

export default FundsList;
