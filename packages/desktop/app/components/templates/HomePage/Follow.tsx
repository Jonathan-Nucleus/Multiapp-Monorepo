import { FC } from "react";
import Image from "next/image";
import { Star } from "phosphor-react";
import Avatar from "shared/assets/images/avatar.svg";
import Bank from "shared/assets/images/bank.svg";

import Input from "../../common/Input";
import Button from "../../common/Button";

const Follow: FC = () => {
  return (
    <div className="min-w-full md:min-w-sideRight">
      <div className="rounded-md border border-gray bg-dark">
        <div className="font-bold text-white border-b p-4 border-dark">
          Invite Your Friends
        </div>
        <div className="p-4">
          <div>Enter (up to 2 more) Email Addresses</div>
          <Input type="text" className="mt-3" />
          <div className="mt-3 mb-4 text-sm">
            We want to seed this platform with those who really have a passion
            for financial markets, economics and great ideas.
          </div>
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center">
              <Image
                src={Avatar}
                width={20}
                height={20}
                alt=""
                className="mr-1"
              />
              <Image
                src={Avatar}
                width={20}
                height={20}
                alt=""
                className="mr-1"
              />
              <Image
                src={Avatar}
                width={20}
                height={20}
                alt=""
                className="mr-1"
              />
              <Image
                src={Avatar}
                width={20}
                height={20}
                alt=""
                className="mr-1"
              />
            </div>
            <Button type="button" variant="gradient-primary">
              <div className="uppercase">Invite</div>
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-md border border-gray bg-dark">
        <div className="font-bold text-white border-b p-4 border-dark">
          Watch List
        </div>
        <div>
          <div className="flex justify-between items-center my-2 border-b pb-2 border-dark px-2">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-md flex items-center justify-cener">
                <Image src={Bank} width={36} height={36} alt="" />
              </div>
              <div className="ml-2">
                <div>Vibrant Ventures Fund</div>
                <div className="text-sm text-zinc-500">Vibrant Ventures</div>
              </div>
            </div>
            <Star size={18} fill="#A5A1FF" weight="fill" />
          </div>
          <div className="flex justify-between items-center my-2 border-b pb-2 border-dark px-2">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-md flex items-center justify-cener">
                <Image src={Bank} width={36} height={36} alt="" />
              </div>
              <div className="ml-2">
                <div>Vibrant Ventures Fund</div>
                <div className="text-sm text-zinc-500">Vibrant Ventures</div>
              </div>
            </div>
            <Star size={18} fill="#A5A1FF" weight="fill" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Follow;
