import { FC, Fragment, useMemo } from "react";
import FundCard from "desktop/app/components/modules/funds/FundCard";
import { Fund } from "shared/graphql/query/marketplace/useFunds";
import Skeleton from "./Skeleton";

import { AssetClasses } from "backend/graphql/enumerations.graphql";

interface FundsListProps {
  loading?: boolean;
  funds: Fund[] | undefined;
}

const FundsList: FC<FundsListProps> = ({ loading, funds }: FundsListProps) => {
  const sectionedFunds = useMemo(() => {
    if (funds) {
      return AssetClasses.map((assetClass) => ({
        title: assetClass.label,
        data: funds.filter((fund) => fund.class === assetClass.value) ?? [],
      })).filter((section) => section.data.length > 0);
    } else {
      return [];
    }
  }, [funds]);

  if (!funds || loading) {
    return <Skeleton />;
  }

  if (funds && funds.length === 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center px-4">
        <span className="text-xl mb-2 text-white">
          {"We're working on it."}
        </span>
        <label className="max-w-lg text-sm text-gray-200 text-center">
          {
            "There are currently no funds available for accredited investors.\nWe’re adding new funds every day, so be sure to check back!"
          }
        </label>
      </div>
    );
  }

  return (
    <>
      {sectionedFunds.map((section) => (
        <Fragment key={section.title}>
          <span className="text-xl mb-2 block mt-10 text-white">
            {section.title}
          </span>
          {section.data.map((fund, index) => (
            <div key={index} className="mb-6">
              <FundCard fund={fund} />
            </div>
          ))}
        </Fragment>
      ))}
    </>
  );
};

export default FundsList;
