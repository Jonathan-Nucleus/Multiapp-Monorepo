import { FC } from "react";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";
import FundCard from "./FundCard";
import Skeleton from "./Skeleton";

interface FundsPageProps {
  funds: GlobalSearchData["globalSearch"]["funds"] | undefined;
}

const FundsPage: FC<FundsPageProps> = ({ funds }) => {
  if (!funds) {
    return <Skeleton />;
  }
  return (
    <div className="divide-y md:divide-none divide-inherit border-white/[.12]">
      {funds.map((fund, index) => (
        <div key={index} className="mb-4">
          <FundCard fund={fund} />
        </div>
      ))}
    </div>
  );
};

export default FundsPage;
