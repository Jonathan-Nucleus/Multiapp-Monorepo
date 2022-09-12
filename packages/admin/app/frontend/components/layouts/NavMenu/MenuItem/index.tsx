import { FC, ReactNode } from "react";

interface MenuItemProps {
  icon: ReactNode;
  menuTitle: string;
  active: boolean;
  onPressed: VoidFunction;
}

const MenuItem: FC<MenuItemProps> = ({
  icon,
  menuTitle,
  active,
  onPressed,
}: MenuItemProps) => {
  const activeStyle = "text-base font-light text-blue-600 pt-1";
  const inactiveStyle = "text-base font-light text-gray-900 pt-1";
  return (
    <button
      type="button"
      className="flex py-5 w-full items-center px-6 py-2 bg-gray-50 hover:bg-gray-100 text-white font-medium"
      onClick={onPressed}
    >
      <div className="mx-3">{icon}</div>
      <h4 className={active === true ? activeStyle : inactiveStyle}>{menuTitle}</h4>
    </button>
  );
};

export default MenuItem;
