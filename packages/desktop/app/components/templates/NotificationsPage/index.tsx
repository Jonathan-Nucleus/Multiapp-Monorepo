import React, { FC } from "react";
import { Gear, Checks, DotsThreeOutlineVertical } from "phosphor-react";
import { Menu } from "@headlessui/react";

import Avatar from "shared/assets/images/apple.svg";
import Button from "../../common/Button";
import Notification from "./Notification";

const Items = [
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: "1",
    unread: false,
    lastMessage: "What a great idea!",
    liked: true,
    createdAt: new Date("Thu Apr 10 2022 19:30:03 GMT-0600"),
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: "51",
    unread: false,
    lastMessage:
      "Sure, I’ll send over the terms and conditions. What’s your name",
    createdAt: new Date("Thu Apr 10 2022 18:30:03 GMT-0600"),
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: "41",
    unread: true,
    lastMessage: "Richard Branson - this is what I was talking about.",
    commented: true,
    createdAt: new Date("Thu Apr 05 2022 18:30:03 GMT-0600"),
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: "31",
    unread: true,
    following: true,
    createdAt: new Date("Thu Apr 05 2022 20:30:03 GMT-0600"),
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: "21",
    unread: true,
    shared: true,
    createdAt: new Date("Thu Apr 11 2022 21:22:03 GMT-0600"),
  },
  {
    name: "Mike Wang",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: "11",
    unread: true,
    message: true,
    createdAt: new Date("Thu Apr 11 2022 20:30:03 GMT-0600"),
  },
  {
    name: "Robert Fox",
    description: "Founder, Investor ",
    company: "Cartenna Capital",
    image: Avatar,
    id: "121",
    unread: true,
    mentioned: true,
    lastMesae: "Richard Branson - this is what I was talking about.",
    createdAt: new Date("Thu Apr 11 2022 17:30:03 GMT-0600"),
  },
];

const NotificationPage: FC = () => {
  return (
    <div className="w-full max-w-4xl m-auto mt-8">
      <div className="flex items-center justify-between mb-4 p-2 md:p-0">
        <div className="text-lg">Notifications</div>
        <div className="flex items-center  hidden md:flex">
          <Checks size={24} color="#00AAE0" weight="fill" />
          <span className="ml-4">Mark all as read</span>
        </div>
        <div className="flex items-center hidden md:flex">
          <Gear size={24} color="#00AAE0" weight="fill" />
          <span className="ml-4">Mark all as read</span>
        </div>
        <div className="flex items-center  block md:hidden">
          <Menu as="div" className="relative">
            <Menu.Button>
              <DotsThreeOutlineVertical size={24} />
            </Menu.Button>
            <Menu.Items className="z-10	absolute right-0 w-64 bg-surface-light10 shadow-md shadow-black rounded">
              <div className="divide-y border-white/[.12] divide-inherit pb-2">
                <div className="flex items-center p-4">
                  <Button variant="text" className="py-0">
                    <Checks size={24} color="#00AAE0" weight="fill" />
                    <span className="ml-4">Mark all as read</span>
                  </Button>
                </div>
                <div className="flex items-center p-4">
                  <Button variant="text" className="py-0">
                    <Gear size={24} color="#00AAE0" weight="fill" />
                    <span className="ml-4">Mark all as read</span>
                  </Button>
                </div>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className="w-full rounded-sm bg-purple divide-y divide-gray-800 rounded-xl border-background-card py-6 bg-background-card">
        {Items.map((v) => (
          <Notification notification={v} key={v.id} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
