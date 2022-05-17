import { FC, Fragment, useEffect, useRef, useState } from "react";
import { MagnifyingGlass, X } from "phosphor-react";
import { Combobox, Transition } from "@headlessui/react";
import SearchItem, { ItemType } from "./SearchItem";
import Button from "../../../../common/Button";
import {
  useGlobalSearchLazy,
} from "shared/graphql/query/search/useGlobalSearch";
import _ from "lodash";
import Spinner from "../../../../common/Spinner";

const defaultItems: ItemType[] = [
  { type: "people" },
  { type: "company" },
  { type: "post" },
  { type: "fund" },
];

const SearchView: FC = () => {
  const [keyword, setKeyword] = useState<string>();
  const [searchItems, setSearchItems] = useState<ItemType[]>(defaultItems);
  const [performSearch, {
    data,
    loading,
  }] = useGlobalSearchLazy();
  const abortController = useRef<AbortController>();
  const searchCallback = useRef(_.debounce(async (search: string) => {
    const controller = new AbortController();
    abortController.current = controller;
    await performSearch({
      variables: { search },
      context: { fetchOptions: { signal: controller.signal } },
    });
  }, 500)).current;
  const abortLatest = () => abortController.current && abortController.current.abort();
  useEffect(() => {
    abortLatest();
    setSearchItems(defaultItems);
    if (keyword && keyword.trim().length >= 2) {
      searchCallback(keyword);
    }
  }, [searchCallback, keyword]);
  useEffect(() => {
    if (!loading && data) {
      const _searchItems = [...defaultItems];
      data.globalSearch.users.slice(0, 2).forEach(user => {
        _searchItems.push({ type: "people", value: { user } });
      });
      data.globalSearch.companies.slice(0, 2).forEach(company => {
        _searchItems.push({ type: "company", value: { company } });
      });
      data.globalSearch.funds.slice(0, 2).forEach(fund => {
        _searchItems.push({ type: "fund", value: { fund } });
      });
      setSearchItems(_searchItems);
    }
  }, [data, loading]);
  return (
    <>
      <div className="relative">
        <Combobox value={keyword} onChange={() => setKeyword("")}>
          <div className="relative">
            <div className="relative">
              <Combobox.Input
                className="leading-5 rounded-3xl bg-black text-xs text-white border border-gray-800 focus-visible:outline-none w-72 pl-4 pr-8 py-2"
                placeholder="Search"
                onChange={(event) => setKeyword(event.target.value)}
              />
              <div className="w-4 h-full flex items-center absolute right-3 top-0">
                {keyword &&
                  <Button
                    variant="text"
                    className="p-0"
                    onClick={() => setKeyword("")}
                  >
                    <X color="white" size={16} />
                  </Button>
                }
                {!keyword && <MagnifyingGlass color="grey" size={16} />}
              </div>
            </div>
            {keyword && keyword.length >= 1 &&
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setKeyword("")}
              >
                <Combobox.Options className="absolute mt-2 max-h-80 w-80 overflow-auto rounded bg-background-popover border border-white/[.12] shadow py-4">
                  <div className="text-sm">
                    {searchItems.map((item, index) => (
                      <div key={index}>
                        <SearchItem item={item} keyword={keyword ?? ""} />
                      </div>
                    ))}
                    {loading &&
                      <div className="text-center pt-3 pb-1">
                        <Spinner />
                      </div>
                    }
                  </div>
                </Combobox.Options>
              </Transition>
            }
          </div>
        </Combobox>
      </div>
    </>
  );
};

export default SearchView;