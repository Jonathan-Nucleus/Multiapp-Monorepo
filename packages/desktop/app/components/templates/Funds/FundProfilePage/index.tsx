import { FC } from "react";
import { FundDetails } from "shared/graphql/query/marketplace/useFund";
import Skeleton from "./Skeleton";
import StrategyFundProfile from "./StrategyFundProfile";

interface FundProfileProps {
  fund?: FundDetails;
}

const FundProfilePage: FC<FundProfileProps> = ({ fund }) => {
  if (!fund) {
    return <Skeleton />;
  }

  return <StrategyFundProfile fund={fund} />;
};

export default FundProfilePage;
