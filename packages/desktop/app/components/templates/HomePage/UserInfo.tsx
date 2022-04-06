import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Avatar from "shared/assets/images/avatar.svg";
import Bank from "shared/assets/images/bank.svg";
import AlSvg from "shared/assets/images/al.svg";

const UserInfo: FC = () => {
  return (
    <div className="min-w-full md:min-w-sideLeft">
      <div className="rounded-md border border-gray bg-dark	p-4">
        <div className="m-auto text-center">
          <Image
            src={Avatar}
            width={88}
            height={88}
            className="rounded-full"
            alt=""
          />
        </div>

        <div className="text-center font-bold text-white leading-6">
          Richard Branson
        </div>
        <div className="text-center text-sm text-zinc-500">Virgin Group</div>
        <div className="flex items-center justify-center my-2">
          <Image src={AlSvg} alt="" draggable={false} />
          <span className="ml-2">Accredited Investor</span>
        </div>

        <div className="flex flex-row px-2 justify-around  mt-3">
          <div className="px-2">
            <div className="text-center font-bold text-white leading-6">64</div>
            <div className="text-center text-sm">posts</div>
          </div>
          <div className="border-r border-l px-4">
            <div className="text-center font-bold text-white leading-6">
              987
            </div>
            <div className="text-center text-sm">Followers</div>
          </div>
          <div className="px-2">
            <div className="text-center font-bold text-white leading-6">
              456
            </div>
            <div className="text-center text-sm">Folling</div>
          </div>
        </div>
        <Link href="/">
          <div className="text-center text-blue-700 mt-4 text-sm">
            See your profile
          </div>
        </Link>
      </div>
      <div className="mt-20 rounded-md border border-gray bg-dark	p-4">
        <div className="m-auto text-center">
          <Image src={Bank} width={88} height={88} alt="" />
        </div>

        <div className="text-center font-bold text-white leading-6">
          Alpha Bank
        </div>
        <div className="flex flex-row px-2 justify-around  mt-3">
          <div className="px-2">
            <div className="text-center font-bold text-white leading-6">64</div>
            <div className="text-center text-sm">posts</div>
          </div>
          <div className="border-r border-l px-4">
            <div className="text-center font-bold text-white leading-6">
              987
            </div>
            <div className="text-center text-sm">Followers</div>
          </div>
          <div className="px-2">
            <div className="text-center font-bold text-white leading-6">
              456
            </div>
            <div className="text-center text-sm">Folling</div>
          </div>
        </div>
        <Link href="/">
          <div className="text-center text-blue-700 mt-4 text-sm">
            See your profile
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserInfo;
