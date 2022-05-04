import React, { FC } from "react";

import Card from "desktop/app/components/common/Card";

const CompanyCard: FC = () => {
  return (
    <div>
      <div className="h-24 flex items-center justify-center">
        <div className="w-[88px] h-[88px] rounded-lg bg-skeleton" />
      </div>
      <Card className="text-center -mt-12">
        <div className="flex items-center justify-center flex-col">
          <div className="w-1/2 h-1 mt-12 bg-skeleton rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-x-4 mt-5">
          <div className="bg-skeleton rounded-md h-8" />
          <div className="bg-skeleton rounded-md h-8" />
          <div className="bg-skeleton rounded-md h-8" />
        </div>
      </Card>
    </div>
  );
};

export default CompanyCard;
