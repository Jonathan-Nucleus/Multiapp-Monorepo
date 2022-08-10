import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { navItems } from "../index";

interface NavItemProps {
  item: typeof navItems[0];
  activePath?: string[] | string;
}

const NavItem: FC<NavItemProps> = ({
  item: { id, title, icon, path },
  activePath = [path],
}: NavItemProps) => {
  const router = useRouter();
  const active =
    typeof activePath == "string"
      ? router.pathname == activePath
      : activePath.includes(router.pathname);
  return (
    <div
      id={id}
      className={"rounded-full" + (active ? " bg-primary-solid/[.3]" : "")}
    >
      <Link href={path}>
        <a className="cursor-pointer px-4 py-1 flex flex-row items-center">
          <span className="flex-shrink-0 flex items-center">{icon}</span>
          <span className="text-sm font-semibold text-white ml-2">{title}</span>
        </a>
      </Link>
    </div>
  );
};

export default NavItem;
