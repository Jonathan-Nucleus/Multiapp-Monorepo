import { FC } from "react";
import { FundDetails } from "shared/graphql/query/marketplace/useFund";
import Skeleton from "./Skeleton";
import StrategyOverview from "./StrategyOverview";
import FundDetailsView from "./FundDetailsView";

interface FundProfileProps {
  fund?: FundDetails;
}

const FundProfilePage: FC<FundProfileProps> = ({ fund }) => {
  if (!fund) {
    return <Skeleton />;
  }

  if (fund.limitedView) {
    return <StrategyOverview fund={fund} />;
  } else {
    return <FundDetailsView fund={fund} />;
  }
};

export default FundProfilePage;
