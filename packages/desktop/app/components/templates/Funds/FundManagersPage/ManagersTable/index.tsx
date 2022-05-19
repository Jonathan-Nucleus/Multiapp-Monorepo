import { ChangeEvent, FC, useMemo, useState } from "react";

import SearchInput from "../../../../common/SearchInput";
import Paginator from "../../../../common/Paginator";

import {
  useFundManagers,
} from "shared/graphql/query/marketplace/useFundManagers";
import { SortAscending, SortDescending } from "phosphor-react";
import ManagerItem from "./ManagerItem";

const ManagersTable: FC = () => {
  const { data: { fundManagers } = {}, loading } = useFundManagers(); // Temporarily use all managers
  const [keyword, setKeyword] = useState<string>();
  const fundsLookup = useMemo(() => {
    const lookup: Record<string, any> = {};
    fundManagers?.managers.forEach(manager => {
      lookup[manager._id] = (manager.managedFundsIds ?? [])
        .map(id => fundManagers?.funds.find(fund => fund._id == id))
        .filter(fund => fund);
    });
    return lookup;
  }, [fundManagers?.funds, fundManagers?.managers]);
  const [headers, setHeaders] = useState<{
    key: string,
    title: string,
    sortable: boolean,
    sort?: "asc" | "desc"
  }[]>([{
    key: "manager",
    title: "Manager Name",
    sortable: true,
    sort: "asc",
  }, {
    key: "company",
    title: "Company",
    sortable: true,
  }, {
    key: "funds",
    title: "Funds Managed",
    sortable: false,
  }, {
    key: "actions",
    title: "",
    sortable: false,
  }]);
  const filteredManagers = useMemo(() => {
    let managers = fundManagers?.managers ?? [];
    if (keyword && keyword.trim().length > 0) {
      managers = managers.filter(manager => {
        return manager.firstName.toLowerCase().includes(keyword.toLowerCase())
          || manager.lastName.toLowerCase().includes(keyword.toLowerCase())
          || manager.company.name.toLowerCase().includes(keyword.toLowerCase());
      });
    }
    return [...managers].sort((manager1, manager2) => {
      const activeSort = headers.find(item => item.sort);
      if (activeSort) {
        const direction = activeSort.sort == "asc" ? 1 : -1;
        if (activeSort.key == "manager") {
          return `${manager1.firstName} ${manager1.lastName}`.localeCompare(`${manager2.firstName} ${manager2.lastName}`) * direction;
        } else if (activeSort.key == "company") {
          return `${manager1.company.name}`.localeCompare(`${manager2.company.name}`) * direction;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });
  }, [fundManagers?.managers, headers, keyword]);
  const onClickHeader = (header: typeof headers[0]) => {
    const _headers = [...headers];
    _headers.forEach((item) => {
      if (item.key == header.key) {
        item.sort = item.sort == "asc" ? "desc" : (item.sort == "desc" ? undefined : "asc");
      } else {
        item.sort = undefined;
      }
    });
    setHeaders(_headers);
  };

  const [page, setPage] = useState(1);
  return (
    <>
      <div className="hidden lg:flex items-center justify-between">
        <h2 className="text-white">All Managers</h2>
        <SearchInput
          placeholder="Search Managers"
          className="w-72"
          value={keyword ?? ""}
          onInput={(event: ChangeEvent<HTMLInputElement>) => setKeyword(event.target.value)}
        />
      </div>
      <div className="mt-4">
        <table className="w-full table-fixed border-collapse">
          <thead className="hidden lg:table-header-group">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="select-none cursor-pointer px-1 py-1"
                >
                  <div
                    className="flex items-center hover:opacity-80 transition-all"
                    onClick={() => header.sortable && onClickHeader(header)}
                  >
                    <div className={`text-tiny text-white ${header.sort ? "font-bold" : "font-medium"}`}>
                      {header.title}
                    </div>
                    <div className="w-4 h-4 ml-2">
                      {header.sort == "asc" &&
                        <SortAscending
                          color="currentColor"
                          weight="bold"
                          size={16}
                        />
                      }
                      {header.sort == "desc" &&
                        <SortDescending
                          color="currentColor"
                          weight="bold"
                          size={16}
                        />
                      }
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredManagers.map((manager) => (
              <ManagerItem
                key={manager._id}
                manager={manager}
                funds={fundsLookup[manager._id]}
              />
            ))}
            <tr>
              <td colSpan={4} className="border-t border-white/[.12]">
                {!loading && filteredManagers.length == 0 &&
                  <div className="text-xs text-white text-gray-500"></div>
                }
              </td>
            </tr>
          </tbody>
        </table>
        <footer className="py-5 invisible">
          <Paginator current={page} total={10} onSelect={setPage} />
        </footer>
      </div>
    </>
  );
};

export default ManagersTable;
