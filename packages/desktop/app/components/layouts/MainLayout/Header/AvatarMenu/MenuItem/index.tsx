import { FC, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface MenuItemProps {
  icon: ReactElement;
  title: string;
  path: string;
  onClick?: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ icon, title, path, onClick }: MenuItemProps) => {
  const router = useRouter();
  return (
    <div
      className="cursor-pointer px-4 py-3 flex flex-row items-center"
      onClick={() => {
        onClick ? onClick() : router.push(path);
      }}
    >
      <div className="flex-shrink-0 flex items-center">{icon}</div>
      <div className="text-sm normal text-white ml-4">{title}</div>
    </div>
  );
};

export default MenuItem;
