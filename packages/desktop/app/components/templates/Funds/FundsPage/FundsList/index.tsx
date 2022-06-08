import { FC, useMemo } from "react";
import FundCard from "desktop/app/components/modules/funds/FundCard";
import { Fund } from "shared/graphql/query/marketplace/useFunds";
import Skeleton from "./Skeleton";

import { AssetClasses } from "backend/graphql/enumerations.graphql";

interface FundsListProps {
  funds: Fund[] | undefined;
}

const FundsList: FC<FundsListProps> = ({ funds }: FundsListProps) => {
  if (!funds) {
    return <Skeleton />;
  }

  const sectionedFunds = useMemo(() => {
    const sectionedData = AssetClasses.map((assetClass) => ({
      title: assetClass.label,
      data: funds.filter((fund) => fund.class === assetClass.value) ?? [],
    })).filter((section) => section.data.length > 0);

    return sectionedData;
  }, [funds]);

  return (
    <>
      {sectionedFunds.map((section) => (
        <>
          <span className="text-xl mb-2 block mt-10">{section.title}</span>
          {section.data.map((fund, index) => (
            <div key={index} className="mb-6">
              <FundCard fund={fund} />
            </div>
          ))}
        </>
      ))}
    </>
  );
};

export default FundsList;
