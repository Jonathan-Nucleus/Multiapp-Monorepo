import { FC, ReactElement } from "react";

interface MenuItemProps {
  icon: ReactElement;
  title: string;
  onClick?: () => void;
}

const MenuItem: FC<MenuItemProps> = ({
  icon,
  title,
  onClick,
}: MenuItemProps) => {
  return (
    <div
      className="cursor-pointer px-4 py-3 flex flex-row items-center  hover:bg-background-blue"
      onClick={() => onClick && onClick()}
    >
      <div className="flex-shrink-0 flex items-center">{icon}</div>
      <div className="text-sm normal text-white ml-4">{title}</div>
    </div>
  );
};

export default MenuItem;
