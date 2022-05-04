import { FC, useState } from "react";
import { SortAscending } from "phosphor-react";

import SearchInput from "../../../../common/SearchInput";
import Button from "../../../../common/Button";
import Paginator from "../../../../common/Paginator";
import ManagerItem from "./ManagerItem";

import { useFundManagers } from "mobile/src/graphql/query/marketplace/useFundManagers";

const ManagersTable: FC = () => {
  const { data: managersData } = useFundManagers(); // Temporarily use all managers
  const { managers, funds } = managersData?.fundManagers ?? {
    managers: [],
    funds: [],
  };

  const [page, setPage] = useState(1);
  return (
    <>
      <div className="hidden lg:flex items-center justify-between">
        <h2 className="text-white">All Managers</h2>
        <SearchInput placeholder="Search Managers" className="w-72" />
      </div>
      <div className="mt-4">
        <div className="border-white/[.12] lg:divide-y divide-inherit">
          <header className="hidden lg:grid grid-cols-4 py-2">
            <div className="flex items-center">
              <div className="text-tiny text-white font-bold">Manager Name</div>
              <Button variant="text" className="text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
            <div className="flex items-center px-1">
              <div className="text-tiny text-white font-medium">Company</div>
              <Button variant="text" className="hidden text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
            <div className="flex items-center px-1">
              <div className="text-tiny text-white font-medium">
                Funds Managed
              </div>
              <Button variant="text" className="hidden text-white ml-2 py-0">
                <SortAscending color="currentColor" weight="bold" size={16} />
              </Button>
            </div>
          </header>
          {managers.map((manager, index) => (
            <div key={index} className="mb-4 lg:mb-0">
              {manager.managedFundsIds && (
                <ManagerItem
                  manager={manager}
                  funds={manager.managedFundsIds.map(
                    (fundId) => funds.find((fund) => fund._id === fundId)!!
                  )}
                />
              )}
            </div>
          ))}
          <footer className="py-5">
            <Paginator current={page} total={10} onSelect={setPage} />
          </footer>
        </div>
      </div>
    </>
  );
};

export default ManagersTable;
