import { FC, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavItemProps {
  icon: ReactElement;
  title: string;
  path: string;
}

const NavItem: FC<NavItemProps> = ({ icon, title, path }: NavItemProps) => {
  const router = useRouter();
  const active = router.pathname == path;
  return (
    <div className={"rounded-full" + (active ? " bg-primary-solid/[.3]" : "")}>
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
