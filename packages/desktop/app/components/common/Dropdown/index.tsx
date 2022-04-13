import { FC, ReactElement } from "react";
import { Menu } from "@headlessui/react";
import { CaretUp, CaretDown } from "phosphor-react";
import {
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from "react-hook-form";

interface DropdownProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  items: { icon?: ReactElement; title: string; value: string }[];
}

function Dropdown<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  items,
  ...controllerProps
}: DropdownProps<TFieldValues, TName>): ReactElement {
  return (
    <Controller
      {...controllerProps}
      render={({ field }) => {
        const selectedItem = items.find((item) => item.value === field.value);
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
                          {selectedItem?.icon && (
                            <span>{selectedItem?.icon}</span>
                          )}
                          <span className="ml-2">{selectedItem?.title}</span>
                        </div>
                        <div className="ml-2">
                          {open ? (
                            <CaretUp
                              color="currentColor"
                              weight="bold"
                              size={16}
                            />
                          ) : (
                            <CaretDown
                              color="currentColor"
                              weight="bold"
                              size={16}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Menu.Button>
                <Menu.Items className="absolute w-48 left-0 mt-2 bg-background-popover shadow-md shadow-black rounded z-10 overflow-hidden py-3">
                  {items.map((item) => (
                    <Menu.Item
                      key={item.value}
                      onClick={() => field.onChange(item.value)}
                    >
                      <div
                        className={
                          item.value === selectedItem?.value
                            ? "bg-primary-overlay/[.24]"
                            : ""
                        }
                      >
                        <div className="text-white text-sm flex items-center px-4 py-3 cursor-pointer">
                          {item.icon && <span>{item.icon}</span>}
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
      }}
    />
  );
}

export default Dropdown;
