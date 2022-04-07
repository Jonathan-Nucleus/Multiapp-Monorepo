import { FC, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarItemProps {
  activeIcon: ReactElement;
  inactiveIcon: ReactElement;
  title: string;
  path: string;
  notifications?: number;
}

const SidebarItem: FC<SidebarItemProps> = ({
  activeIcon,
  inactiveIcon,
  title,
  path,
  notifications,
}: SidebarItemProps) => {
  const router = useRouter();
  const active = router.pathname == path;
  return (
    <div className={active ? "bg-secondary-overlay/[.12]" : ""}>
      <Link href={path}>
        <a className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="flex-shrink-0 flex items-center">
              {active && activeIcon}
              {!active && inactiveIcon}
            </span>
            <span className="text-sm normal text-white ml-4">{title}</span>
          </div>
          {notifications != 0 && (
            <span className="bg-error rounded-full w-6 h-6 text-xs leading-3 text-white flex items-center justify-center font-medium">
              1
            </span>
          )}
        </a>
      </Link>
    </div>
  );
};

export default SidebarItem;
