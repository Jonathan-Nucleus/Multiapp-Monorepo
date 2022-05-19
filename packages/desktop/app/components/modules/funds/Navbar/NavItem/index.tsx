import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavItemProps {
  path: string;
  title: string;
}

const NavItem: FC<NavItemProps> = ({ path, title }: NavItemProps) => {
  const router = useRouter();
  return (
    <>
      <Link href={path}>
        <a
          className={
            "inline-flex items-center justify-center w-full text-xs md:text-sm text-center py-3 border-b-2 " +
            (router.pathname == path
              ? "text-white font-bold border-purple-secondary"
              : "text-primary font-medium border-transparent")
            + " hover:text-white transition-all"
          }
        >
          {title}
        </a>
      </Link>
    </>
  );
};

export default NavItem;
