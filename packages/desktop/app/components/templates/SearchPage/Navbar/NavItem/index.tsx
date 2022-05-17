import { FC, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavItemProps {
  path: string;
  icon?: ReactElement;
  title: string;
}

const NavItem: FC<NavItemProps> = ({ path, icon, title }: NavItemProps) => {
  const router = useRouter();
  return (
    <>
      <Link href={path}>
        <a
          className={
            "inline-flex items-center justify-center w-full text-xs md:text-sm text-center py-3 border-b-2 " +
            (router.asPath == path
              ? "text-white font-bold border-purple-secondary"
              : "text-white/[.6] font-medium border-transparent")
            + " hover:text-white transition-all"
          }
        >
          {icon && <span className="mr-3">{icon}</span>}
          {title}
        </a>
      </Link>
    </>
  );
};

export default NavItem;
