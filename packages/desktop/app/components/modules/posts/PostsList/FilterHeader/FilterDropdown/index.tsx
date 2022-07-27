import { ChangeEvent, FC, useState } from "react";
import { Popover } from "@headlessui/react";
import Checkbox from "desktop/app/components/common/Checkbox";
import Label from "desktop/app/components/common/Label";
import Radio from "desktop/app/components/common/Radio";
import Button from "desktop/app/components/common/Button";

import { PostCategories } from "backend/graphql/enumerations.graphql";
import { PostCategory } from "backend/graphql/posts.graphql";
import { FilterChangeCallback } from "../index";
import {
  PostRoleFilterEnum,
  PostRoleFilterOptions,
} from "backend/schemas/post";

interface FilterDropdownProps {
  categories: PostCategory[];
  postedFrom: PostRoleFilterEnum;
  onApplyFilter: FilterChangeCallback;
}

const FilterDropdown: FC<FilterDropdownProps> = ({
  categories: defaultCategories,
  postedFrom: defaultPostedFrom,
  onApplyFilter,
}: FilterDropdownProps) => {
  const [selectedCategories, setSelectedCategories] =
    useState(defaultCategories);
  const [selectedPostedFrom, setSelectedPostedFrom] =
    useState(defaultPostedFrom);

  return (
    <>
      <div className="bg-background-popover shadow shadow-black rounded">
        <div className="grid grid-cols-3 p-5">
          <div className="col-span-2">
            <div className="text-xs text-white font-medium">Topics</div>
            <div className="grid grid-cols-2 mt-3">
              {Object.keys(PostCategories).map((category, index) => (
                <div key={index} className="flex items-center py-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => {
                      if (selectedCategories.includes(category)) {
                        setSelectedCategories(
                          [...selectedCategories].filter(
                            (item) => item != category
                          )
                        );
                      } else {
                        setSelectedCategories([
                          ...selectedCategories,
                          category,
                        ]);
                      }
                    }}
                  />
                  <Label htmlFor={category} className="font-medium ml-2">
                    {PostCategories[category]}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-white font-medium">Posts From</div>
            <div className="mt-3">
              {Object.keys(PostRoleFilterOptions).map((key, index) => (
                <div key={index} className="flex items-center py-2">
                  <Radio
                    id={key}
                    checked={selectedPostedFrom == key}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      if (event.target.checked) {
                        setSelectedPostedFrom(key);
                      }
                    }}
                  />
                  <Label htmlFor={key} className="font-medium ml-2">
                    {PostRoleFilterOptions[key].label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/[.12] text-center p-4">
          <Popover.Button as="div" className="inline-block select-none">
            <Button
              variant="gradient-primary"
              className="font-medium px-10"
              onClick={() =>
                onApplyFilter({
                  categories: selectedCategories,
                  roleFilter: selectedPostedFrom,
                })
              }
            >
              Apply Filters
            </Button>
          </Popover.Button>
        </div>
      </div>
    </>
  );
};

export default FilterDropdown;
