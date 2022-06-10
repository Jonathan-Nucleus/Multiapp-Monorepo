import { FC, Fragment, useEffect, useRef, useState } from "react";
import { MagnifyingGlass, X } from "phosphor-react";
import { Combobox, Transition } from "@headlessui/react";
import SearchItem, { ItemType } from "./SearchItem";
import Button from "../../../../common/Button";
import { useGlobalSearchLazy } from "shared/graphql/query/search/useGlobalSearch";
import _ from "lodash";
import Spinner from "../../../../common/Spinner";
import { useRouter } from "next/router";
import { SearchTypeOptions } from "../../../../templates/SearchPage";

const defaultItems: ItemType[] = [
  { type: "people" },
  { type: "company" },
  { type: "post" },
  { type: "fund" },
];

const SearchView: FC = () => {
  const [keyword, setKeyword] = useState<string>();
  const [searchItems, setSearchItems] = useState<ItemType[]>(defaultItems);
  const [selected, setSelected] = useState();
  const [performSearch, { data, loading, refetch, called }] =
    useGlobalSearchLazy();
  const searchCallback = useRef(
    _.debounce(async (search: string) => {
      if (!called) {
        await performSearch({
          variables: { search },
        });
      } else {
        refetch({ search });
      }
    }, 500)
  ).current;
  useEffect(() => {
    setSearchItems(defaultItems);
    if (keyword && keyword.trim().length >= 2) {
      searchCallback(keyword);
    }
  }, [searchCallback, keyword]);
  useEffect(() => {
    if (!loading && data) {
      const _searchItems = [...defaultItems];
      data.globalSearch.users.slice(0, 2).forEach((user) => {
        _searchItems.push({
          type: "people",
          value: { user, link: `/profile/${user._id}` },
        });
      });
      data.globalSearch.companies.slice(0, 2).forEach((company) => {
        _searchItems.push({
          type: "company",
          value: { company, link: `/company/${company._id}` },
        });
      });
      data.globalSearch.funds.slice(0, 2).forEach((fund) => {
        _searchItems.push({
          type: "fund",
          value: { fund, link: `/funds/${fund._id}` },
        });
      });
      setSearchItems(_searchItems);
    }
  }, [data, loading]);
  const router = useRouter();
  return (
    <>
      <div className="relative">
        <Combobox
          value={selected}
          onChange={async (value: ItemType | undefined) => {
            if (!value) {
              await router.push(`/search/all?query=${keyword}`);
            } else if (!value.value) {
              await router.push(
                `/search/${
                  SearchTypeOptions[value.type].route
                }?query=${keyword}`
              );
            } else {
              await router.push(value.value.link);
            }
          }}
        >
          <div className="relative">
            <div className="relative">
              <Combobox.Input
                className="leading-5 rounded-3xl bg-black text-xs text-white border border-gray-800 focus-visible:outline-none w-72 pl-4 pr-8 py-2"
                placeholder="Search"
                onChange={(event) => setKeyword(event.target.value)}
              />
              <div className="w-4 h-full flex items-center absolute right-3 top-0">
                {keyword && (
                  <Button
                    variant="text"
                    className="p-0"
                    onClick={() => setKeyword("")}
                  >
                    <X color="white" size={16} />
                  </Button>
                )}
                {!keyword && <MagnifyingGlass color="grey" size={16} />}
              </div>
            </div>
            {keyword && keyword.length >= 1 && (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => {
                  setKeyword("");
                  setSelected(undefined);
                }}
              >
                <Combobox.Options className="absolute mt-2 max-h-80 w-80 overflow-auto rounded bg-background-popover border border-white/[.12] shadow py-4">
                  <div className="text-sm">
                    <Combobox.Option value={undefined} />
                    {searchItems.map((item, index) => (
                      <Combobox.Option
                        key={index}
                        value={item}
                        className={({ active }) =>
                          `select-none ${
                            active ? "bg-primary-overlay/[.12]" : ""
                          }`
                        }
                      >
                        <SearchItem item={item} keyword={keyword ?? ""} />
                      </Combobox.Option>
                    ))}
                    {loading && (
                      <div className="text-center pt-3 pb-1">
                        <Spinner />
                      </div>
                    )}
                  </div>
                </Combobox.Options>
              </Transition>
            )}
          </div>
        </Combobox>
      </div>
    </>
  );
};

export default SearchView;
