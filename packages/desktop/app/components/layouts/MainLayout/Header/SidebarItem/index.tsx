import { FC, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarItemProps {
  activeIcon: ReactElement;
  inactiveIcon: ReactElement;
  title: string;
  path: string;
}

const SidebarItem: FC<SidebarItemProps> = ({
  activeIcon,
  inactiveIcon,
  title,
  path,
}: SidebarItemProps) => {
  const router = useRouter();
  const active = router.pathname == path;
  return (
    <div className={active ? "bg-secondary-overlay/[.12]" : ""}>
      <Link href={path}>
        <a className="cursor-pointer px-4 py-3 flex flex-row items-center">
          <span className="flex-shrink-0 flex items-center">
            {active && activeIcon}
            {!active && inactiveIcon}
          </span>
          <span className="text-sm normal text-white ml-4">{title}</span>
        </a>
      </Link>
    </div>
  );
};

export default SidebarItem;
