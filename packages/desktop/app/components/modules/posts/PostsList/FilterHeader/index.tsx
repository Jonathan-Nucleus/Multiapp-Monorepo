import { FC, Fragment, useState } from "react";
import { PostCategory } from "backend/graphql/posts.graphql";
import Button from "../../../../common/Button";
import { CaretDown, SlidersHorizontal, X } from "phosphor-react";
import { PostCategories } from "backend/graphql/enumerations.graphql";
import FilterDropdown from "./FilterDropdown";
import { Popover, Transition } from "@headlessui/react";
import {
  PostRoleFilterEnum,
  PostRoleFilterOptions,
} from "backend/schemas/post";

export type FilterChangeCallback = (
  categories: PostCategory[],
  filter: PostRoleFilterEnum
) => void;

interface FilterHeaderProps {
  onFilterChange: FilterChangeCallback;
}

const FilterHeader: FC<FilterHeaderProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [postedFrom, setPostedFrom] = useState<PostRoleFilterEnum>("EVERYONE");
  const onRemoveCategory = (category: PostCategory) => {
    filterChangeCallback(
      [...categories].filter((item) => item != category),
      postedFrom
    );
  };
  const filterChangeCallback: FilterChangeCallback = (
    _categories,
    _postedFrom
  ) => {
    setCategories(_categories);
    setPostedFrom(_postedFrom);
    onFilterChange(_categories, _postedFrom);
  };
  return (
    <Popover as="div">
      {({ open }) => (
        <>
          <Popover.Button as="div" className="inline-block select-none">
            <Button
              variant="text"
              className="bg-transparent rounded font-normal tracking-normal px-2 py-1"
            >
              <SlidersHorizontal color="white" size={24} />
              <div className="text-white ml-2">
                <span className="font-semibold">
                  {categories.length == 0 ? "All" : "Filtered"}
                </span>
                <span> posts from </span>
                <span className="font-semibold">
                  {PostRoleFilterOptions[postedFrom].label}
                </span>
              </div>
              <CaretDown color="white" size={24} className="ml-2" />
            </Button>
          </Popover.Button>
          <div className="relative">
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center -mx-1">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-white/[.12] rounded-full flex items-center mx-1 my-1 px-3 py-1"
                  >
                    <div className="text-xs text-white">
                      {PostCategories[category]}
                    </div>
                    <X
                      color="white"
                      weight="bold"
                      size={16}
                      className="ml-2 cursor-pointer"
                      onClick={() => onRemoveCategory(category)}
                    />
                  </div>
                ))}
              </div>
            )}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-0 top-0.5 z-10">
                <div>
                  {open && (
                    <FilterDropdown
                      categories={categories}
                      postedFrom={postedFrom}
                      onApplyFilter={filterChangeCallback}
                    />
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </div>
        </>
      )}
    </Popover>
  );
};

export default FilterHeader;
