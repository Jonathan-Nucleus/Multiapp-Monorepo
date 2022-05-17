import React, { FC } from "react";
import { Gear, Checks, DotsThreeOutlineVertical } from "phosphor-react";
import { Menu } from "@headlessui/react";

import Button from "../../common/Button";
import NotificationItem from "./NotificationItem";
import {
  useNotifications,
} from "shared/graphql/query/notification/useNotifications";
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
    <div className="max-w-2xl m-auto mt-8">
      <div className="flex items-center justify-between mb-4 px-2 md:p-0">
        <div className="text-2xl">Notifications</div>
        <Button
          variant="text"
          className="flex items-center text-sm text-primary font-medium tracking-wider hidden md:flex"
          onClick={() => handleReadAllNotifications()}
        >
          <Checks size={24} color="currentColor" weight="fill" />
          <span className="ml-2">Mark all as read</span>
        </Button>
        <Button
          variant="text"
          className="flex items-center text-sm text-primary font-medium tracking-wider hidden md:flex"
        >
          <Gear size={24} color="currentColor" weight="fill" />
          <span className="ml-2">Notification settings</span>
        </Button>
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
  );
};

export default NotificationPage;
