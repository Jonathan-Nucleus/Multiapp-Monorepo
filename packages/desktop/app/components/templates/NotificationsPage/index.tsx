import React, { FC } from "react";
import { Gear, Checks, DotsThreeOutlineVertical } from "phosphor-react";
import { Menu } from "@headlessui/react";
import DisclosureCard from "desktop/app/components/modules/funds/DisclosureCard";

import Button from "../../common/Button";
import NotificationItem from "./NotificationItem";
import { useNotifications } from "shared/graphql/query/notification/useNotifications";
import {
  useReadNotification,
  useReadNotifications,
} from "shared/graphql/mutation/notification";
import Card from "../../common/Card";

const NotificationPage: FC = () => {
  const { data } = useNotifications();
  const [readNotification] = useReadNotification();
  const [readNotifications] = useReadNotifications();
  const notifications = data?.notifications ?? [];
  const handleReadNotification = async (id?: string) => {
    try {
      await readNotification({
        variables: {
          notificationId: id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleReadAllNotifications = async () => {
    try {
      await readNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lg:ml-48 xl:ml-80 max-w-6xl m-auto mt-8 pl-12">
      <div className="flex items-center mb-4 px-2 max-w-2xl mr-96">
        <div className="text-2xl mr-4 text-white">Notifications</div>
        <Button
          variant="text"
          className="flex items-center text-sm text-primary font-medium tracking-wider md:flex"
          onClick={() => handleReadAllNotifications()}
        >
          <Checks size={24} color="currentColor" weight="fill" />
          <span className="ml-2">Mark all as read</span>
        </Button>
        {/**
          * Remove until post-launch
          <Button
          variant="text"
          className="flex items-center text-sm text-primary font-medium tracking-wider md:flex"
        >
          <Gear size={24} color="currentColor" weight="fill" />
          <span className="ml-2">Notification settings</span>
        </Button>
        */}
        <div className="flex md:hidden items-center">
          <Menu as="div" className="relative">
            <Menu.Button>
              <DotsThreeOutlineVertical
                size={24}
                weight="fill"
                className="opacity-60"
              />
            </Menu.Button>
            <Menu.Items className="z-20	absolute right-0 w-64 bg-background-popover shadow-md shadow-black rounded overflow-hidden">
              <div className="py-2">
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={() => handleReadAllNotifications()}
                  >
                    <Checks size={24} color="currentColor" weight="fill" />
                    <span className="ml-2">Mark all as read</span>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={() => {}}
                  >
                    <Gear size={24} color="currentColor" weight="fill" />
                    <span className="ml-2">Notification settings</span>
                  </div>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="max-w-2xl flex-1">
          <Card className="bg-background-cardDark border-none rounded-none sm:rounded-2xl mb-8 px-0 py-4">
            <div className="divide-y divide-inherit border-white/[.12]">
              {notifications.map((notification) => (
                <NotificationItem
                  notification={notification}
                  key={notification._id}
                  handleReadNotification={(id) => handleReadNotification(id)}
                />
              ))}
            </div>
          </Card>
        </div>
        <div className="w-80 ml-8">
          <DisclosureCard />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
