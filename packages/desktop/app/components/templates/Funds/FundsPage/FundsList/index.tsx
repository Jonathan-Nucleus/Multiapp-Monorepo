import { FC } from "react";
import FundCard from "desktop/app/components/modules/funds/FundCard";
import { Fund } from "mobile/src/graphql/query/marketplace/useFunds";
import Skeleton from "./Skeleton";

interface FundsListProps {
  funds: Fund[] | undefined;
}

const FundsList: FC<FundsListProps> = ({ funds }: FundsListProps) => {
  if (!funds) {
    return <Skeleton />;
  }
  return (
    <>
      {funds.map((fund, index) => (
        <div key={index} className="mb-6">
          <FundCard fund={fund} />
        </div>
      ))}
    </>
  );
};

export default FundsList;
