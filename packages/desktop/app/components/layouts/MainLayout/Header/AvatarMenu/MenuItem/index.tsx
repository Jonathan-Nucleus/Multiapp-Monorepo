import { FC, ReactElement } from "react";
import Link from "next/link";

interface MenuItemProps {
  icon: ReactElement;
  title: string;
  path: string;
}

const MenuItem: FC<MenuItemProps> = ({ icon, title, path }: MenuItemProps) => {
  return (
    <div>
      <Link href={path}>
        <a className="cursor-pointer px-4 py-3 flex flex-row items-center">
          <span className="flex-shrink-0 flex items-center">{icon}</span>
          <span className="text-sm normal text-white ml-4">{title}</span>
        </a>
      </Link>
    </div>
  );
};

export default MenuItem;
