import React, { FC } from "react";
import { Gear, Checks, DotsThreeOutlineVertical } from "phosphor-react";
import { Menu } from "@headlessui/react";

import Button from "../../common/Button";
import NotificationDetail from "./Notification";
import { useNotifications } from "shared/graphql/query/notification/useNotifications";
import {
  useReadNotification,
  useReadNotifications,
} from "shared/graphql/mutation/notification";

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
    <div className="w-full max-w-4xl m-auto mt-8">
      <div className="flex items-center justify-between mb-4 p-2 md:p-0">
        <div className="text-lg">Notifications</div>
        <Button
          variant="text"
          className="flex items-center  hidden md:flex"
          onClick={() => handleReadAllNotifications()}
        >
          <Checks size={24} color="#00AAE0" weight="fill" />
          <span className="ml-4">Mark all as read</span>
        </Button>
        <Button variant="text" className="flex items-center hidden md:flex">
          <Gear size={24} color="#00AAE0" weight="fill" />
          <span className="ml-4">Notification settings</span>
        </Button>
        <div className="flex items-center  block md:hidden">
          <Menu as="div" className="relative">
            <Menu.Button>
              <DotsThreeOutlineVertical size={24} />
            </Menu.Button>
            <Menu.Items className="z-10	absolute right-0 w-64 bg-surface-light10 shadow-md shadow-black rounded">
              <div className="divide-y border-white/[.12] divide-inherit pb-2">
                <div className="flex items-center p-4">
                  <Button
                    variant="text"
                    className="py-0"
                    onClick={() => handleReadAllNotifications()}
                  >
                    <Checks size={24} color="#00AAE0" weight="fill" />
                    <span className="ml-4">Mark all as read</span>
                  </Button>
                </div>
                <div className="flex items-center p-4">
                  <Button variant="text" className="py-0">
                    <Gear size={24} color="#00AAE0" weight="fill" />
                    <span className="ml-4">Notification settings</span>
                  </Button>
                </div>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className="w-full rounded-sm bg-purple divide-y divide-gray-800 rounded-xl border-background-card py-6 bg-background-card">
        {notifications.map((v) => (
          <NotificationDetail
            notification={v}
            key={v._id}
            handleReadNotification={(id) => handleReadNotification(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
