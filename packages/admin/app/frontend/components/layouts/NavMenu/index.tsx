import { FC, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  HouseLine,
  User,
  UsersThree,
  Folder,
  Buildings,
  Sliders,
} from "phosphor-react";

import Search from "../../common/Search";
import MenuItem from "./MenuItem";
import Logo from "shared/assets/images/pro-admin-logo.svg";

const menuItems = {
  Home: HouseLine,
  Users: UsersThree,
  Funds: Folder,
  Companies: Buildings,
  System: Sliders,
};

const routes = {
  users: "/",
  home: "/home",
  funds: "/funds",
  companies: "/companies",
  system: "/system",
  admin: "/admin",
};

const NavMenu: FC = () => {
  const [menu, setMenu] = useState(1);
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-left items-start pt-3 basis-1/12 bg-gray-50 border-b pb-2">
        <Image src={Logo} alt="" height={30} width={60} />
        <h4 className="text-lg text-gray-900 font-medium">Prometheus</h4>
      </div>
      <div className="h-3/5 bg-gray-50 border-b">
        {Object.keys(menuItems).map((key, index) => {
          const Icon = menuItems[key];
          const navigate = (): string => {
            if (index === 0) {
              return routes.home;
            } else if (index === 1) {
              return routes.users;
            } else if (index === 2) {
              return routes.funds;
            } else if (index === 3) {
              return routes.companies;
            } else if (index === 4) {
              return routes.system;
            }
            return routes.users;
          };
          return (
            <MenuItem
              key={key}
              icon={
                <Icon color={menu === index ? "#2563eb" : "#333"} size={25} />
              }
              menuTitle={key}
              active={menu === index ? true : false}
              onPressed={() => {
                setMenu(index);
                router.push(navigate()!);
              }}
            />
          );
        })}
        <div className="p-5">
          <Search onSearch={() => console.log("Searching")} />
        </div>
      </div>
      <div className="h-2/6 bg-gray-50">
        <MenuItem
          icon={<User color={menu === 6 ? "#2563eb" : "#333"} size={20} />}
          menuTitle={"Admin"}
          active={menu === 6 ? true : false}
          onPressed={() => {
            setMenu(6);
            router.push(routes.admin);
          }}
        />
      </div>
    </div>
  );
};

export default NavMenu;
