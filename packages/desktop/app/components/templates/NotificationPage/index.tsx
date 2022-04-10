import { FC, useState, useEffect } from "react";
import "@splidejs/react-splide/css";
import Avatar from "shared/assets/images/apple.svg";
import {
  Gear,
  Checks,
  ChatCenteredText,
  DotsThreeOutlineVertical,
} from "phosphor-react";
import Image from "next/image";
import Button from "../../common/Button";

const Items = [
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: 1,
    read: false,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: 51,
    read: false,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: 41,
    read: true,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: 31,
    read: true,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: 21,
    read: true,
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: 11,
    read: true,
  },
];

const NotificationPage: FC = () => {
  return (
    <div>
      <div className="w-full max-w-4xl m-auto">
        <div className="flex items-center justify-between my-2 p-2 md:p-0">
          <div className="mr-8">Notifications</div>
          <div className="flex items-center  hidden md:flex">
            <Checks size={32} color="#00AAE0" weight="fill" />
            <span className="ml-4">Mark all as read</span>
          </div>
          <div className="flex items-center hidden md:flex">
            <Gear size={32} color="#00AAE0" weight="fill" />
            <span className="ml-4">Mark all as read</span>
          </div>
          <div className="flex items-center  block md:hidden">
            <Button variant="text">
              <DotsThreeOutlineVertical size={32} />
            </Button>
          </div>
        </div>
        <div className="w-full rounded-sm bg-purple divide-y">
          {Items.map((v) => {
            return (
              <div className="flex justify-between items-center p-4" key={v.id}>
                <div className="flex items-center">
                  <div className="relative">
                    <Image src={Avatar} width={48} height={48} alt="" />
                    <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1">
                      <ChatCenteredText size={18} />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="font-bold">
                      Kristin Watson commented on your post
                    </div>
                    <div className="text-zinc-500">What a great idea!</div>
                  </div>
                </div>
                <div className="text-sm text-zinc-500">1hr ago</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
