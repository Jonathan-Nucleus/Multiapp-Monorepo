import { FC } from "react";
import Checkbox from "../../../../../common/Checkbox";
import Label from "../../../../../common/Label";

const categories = [
  "All",
  "Materials",
  "News",
  "Energy",
  "Politics",
  "Crypto",
  "Ideas",
  "ESG",
  "Education",
  "Venture Capital",
  "Questions",
  "Private Equity",
  "Technology",
  "Hedge Funds",
  "Consumer",
  "Entertainment",
  "Industrials",
  "Real Estate",
  "Healthcare",
  "OpEd",
  "Financials",
];

const CategorySelector: FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-white/[.6] p-4 border-b border-white/[.12]">
        <div className="text-sm">Categories</div>
        <div className="text-xs mt-2">
          Select categories to make your post easier to find and visible to more
          people.
        </div>
      </div>
      <div className="py-2 min-h-0 overflow-y-auto">
        {categories.map((item, index) => (
          <div key={index} className="flex items-center px-4 py-2">
            <Checkbox id={`category-${index}`} />
            <Label htmlFor={`category-${index}`} className="text-sm ml-3">
              {item}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
