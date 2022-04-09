import { ChangeEvent, FC, useState } from "react";
import { Popover } from "@headlessui/react";
import { CaretDown, SlidersHorizontal, X } from "phosphor-react";
import Checkbox from "../../../../common/Checkbox";
import Label from "../../../../common/Label";
import Radio from "../../../../common/Radio";
import Button from "../../../../common/Button";

const topicItems = [
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
const fromItems = [
  "Pros + people I follow",
  "Professionals",
  "People I follow",
  "Everyone",
];

interface FilterDropdownProps {
  topics: string[];
  from: string;
  onSelect: (topics: string[], from: string) => void;
}

const FilterDropdown: FC<FilterDropdownProps> = ({
  topics,
  from,
  onSelect,
}: FilterDropdownProps) => {
  const [selectedTopics, setSelectedTopics] = useState(topics);
  const [selectedFrom, setSelectedFrom] = useState(from);
  return (
    <>
      <Popover as="div" className="relative">
        {({ close }) => (
          <>
            <div>
              <Popover.Button>
                <div className="flex items-center bg-primary-overlay/[.08] rounded px-2 py-1">
                  <SlidersHorizontal color="white" size={24} />
                  <div className="text-white ml-2">
                    <span className="font-semibold">
                      {topics.includes("All") ? "All" : "Filtered"}
                    </span>
                    <span> posts from </span>
                    <span className="font-semibold">{from}</span>
                  </div>
                  <CaretDown color="white" size={24} className="ml-2" />
                </div>
              </Popover.Button>
            </div>
            {!topics.includes("All") && (
              <div className="flex flex-wrap items-center -mx-1">
                {topics.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-white/[.12] rounded-full flex items-center mx-1 my-1 px-3 py-1"
                  >
                    <div className="text-xs text-white">{topic}</div>
                    <X
                      color="white"
                      weight="bold"
                      size={16}
                      className="ml-2 cursor-pointer"
                      onClick={() => {}}
                    />
                  </div>
                ))}
              </div>
            )}
            <Popover.Panel className="absolute left-0 bg-background-popover shadow-md shadow-black rounded z-10">
              <div className="grid grid-cols-3 p-5">
                <div className="col-span-2">
                  <div className="text-xs text-white font-medium">TOPICS</div>
                  <div className="grid grid-cols-2 mt-3">
                    {topicItems.map((item, index) => (
                      <div key={index} className="flex items-center my-2">
                        <Checkbox
                          id={`topic-${index}`}
                          checked={selectedTopics.includes(item)}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const _selectedTopics = [...selectedTopics];
                            const index = _selectedTopics.indexOf(item);
                            if (event.target.checked) {
                              if (item == "All") {
                                _selectedTopics.splice(0);
                                _selectedTopics.push(item);
                              } else {
                                if (_selectedTopics.indexOf("All") != -1) {
                                  _selectedTopics.splice(
                                    _selectedTopics.indexOf("All"),
                                    1
                                  );
                                }
                                if (index == -1) {
                                  _selectedTopics.push(item);
                                }
                              }
                            } else {
                              if (index != -1) {
                                _selectedTopics.splice(index, 1);
                              }
                            }
                            setSelectedTopics(_selectedTopics);
                          }}
                        />
                        <Label
                          htmlFor={`topic-${index}`}
                          className="font-medium ml-2"
                        >
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white font-medium uppercase">
                    posts from
                  </div>
                  <div className="mt-3">
                    {fromItems.map((item, index) => (
                      <div key={index} className="flex items-center py-2">
                        <Radio
                          id={`from-${index}`}
                          name="from"
                          defaultChecked={selectedFrom == item}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            if (event.target.checked) {
                              setSelectedFrom(item);
                            }
                          }}
                        />
                        <Label
                          htmlFor={`from-${index}`}
                          className="font-medium ml-2"
                        >
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-white/[.12] text-center p-4">
                <Button
                  variant="gradient-primary"
                  className="font-medium uppercase px-10"
                  onClick={() => {
                    onSelect(selectedTopics, selectedFrom);
                    close();
                  }}
                >
                  apply filters
                </Button>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  );
};

export default FilterDropdown;
