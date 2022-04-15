import { FC } from "react";
import FundCard from "../../../../modules/funds/FundCard";
import { Fund } from "mobile/src/graphql/query/marketplace";

interface FundsListProps {
  funds: Fund[];
}

const FundsList: FC<FundsListProps> = ({ funds }: FundsListProps) => {
  return (
    <>
      {funds!.map((fund, index) => (
        <div key={index} className="mb-6">
          <FundCard fund={fund} />
        </div>
      ))}
    </>
  );
};

export default FundsList;
