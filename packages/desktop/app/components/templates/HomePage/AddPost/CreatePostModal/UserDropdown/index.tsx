import { Menu } from "@headlessui/react";
import { FC, ReactElement } from "react";
import { CaretUp, CaretDown } from "phosphor-react";

interface DropdownProps {
  selected: number;
  items: { icon: ReactElement; title: string }[];
  onSelect: (index: number) => void;
}

const UserDropdown: FC<DropdownProps> = ({
  selected,
  items,
  onSelect,
}: DropdownProps) => {
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button>
            <div className="border border-primary-solid rounded-full">
              <div className="px-4 py-1">
                <div
                  className={
                    "flex items-center " +
                    (open ? "text-primary-medium" : "text-white")
                  }
                >
                  <div className="text-sm flex items-center">
                    <span>{items[selected].icon}</span>
                    <span className="ml-2">{items[selected].title}</span>
                  </div>
                  <div className="ml-2">
                    {open ? (
                      <CaretUp color="currentColor" weight="bold" size={16} />
                    ) : (
                      <CaretDown color="currentColor" weight="bold" size={16} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Menu.Button>
          <Menu.Items className="absolute w-48 left-0 mt-2 bg-background-popover shadow-md shadow-black rounded z-10 overflow-hidden py-3">
            {items.map((item, index) => (
              <Menu.Item key={index} onClick={() => onSelect(index)}>
                <div
                  className={
                    selected == index ? "bg-primary-overlay/[.24]" : ""
                  }
                >
                  <div className="text-white text-sm flex items-center px-4 py-3 cursor-pointer">
                    <span>{item.icon}</span>
                    <span className="ml-2">{item.title}</span>
                  </div>
                </div>
              </Menu.Item>
            ))}
          </Menu.Items>
        </>
      )}
    </Menu>
  );
};

export default UserDropdown;
