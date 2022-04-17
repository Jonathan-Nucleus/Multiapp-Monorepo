import { FC } from "react";
import FundItem from "desktop/app/components/common/FundsList/FundItem";
import { Fund } from "mobile/src/graphql/query/marketplace";

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
