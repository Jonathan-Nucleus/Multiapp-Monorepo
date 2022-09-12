import { FC, ReactNode, useState } from "react";
import TabButton from "../TabButton";

interface TabsProps {
  tabTitles: string[];
  tabScreens: ReactNode[];
}

const Tabs: FC<TabsProps> = ({ tabTitles, tabScreens }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-1 mt-16 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {Object.keys(tabTitles).map((key, index) => {
            return (
              <li
                className={key === 0 ? "ml-2" : "ml-0" + "mr-2"}
                key={`tab-${index}`}
              >
                <TabButton
                  tabTitle={tabTitles[index]}
                  selected={selectedTab === index ? true : false}
                  onPressed={() => setSelectedTab(index)}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="h-48 overflow-y-scroll bg-white grow">
        {tabScreens[selectedTab]}
      </div>
    </div>
  );
};

export default Tabs;
