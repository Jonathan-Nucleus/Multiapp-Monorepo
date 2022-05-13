import { FC, useEffect } from "react";
import Image from "next/image";
import Card from "desktop/app/components/common/Card";
import ProfileSettings from "./ProfileSettings";
import AdminSettings from "./AdminSettings";
import InviteFriends from "../../modules/users/InviteFriends";

import PushNotificationImage from "shared/assets/images/sms-notification.svg";
import EmailNotificationImage from "shared/assets/images/email-notification.svg";

import {
  NotificationEvent,
  NotificationEventOptions,
  NotificationMethodEnum,
} from "backend/schemas/user";
import { useAccount } from "shared/graphql/query/account/useAccount";
import { useUpdateSettings } from "shared/graphql/mutation/account/useUpdateSettings";
import ToggleSwitch from "../../common/ToggleSwitch";
import { useForm } from "react-hook-form";
import { SettingsInput } from "backend/graphql/users.graphql";
import Link from "next/link";
import { CaretRight } from "phosphor-react";

const notificationItems = Object.keys(NotificationEventOptions).map((key) => {
  return {
    key,
    ...NotificationEventOptions[key],
  };
});

type FormValues = {
  tagging: boolean;
  messaging: boolean;
  emailUnreadMessage: boolean;
  enablePush: boolean;
  enableEmail: boolean;
  notifications: Record<NotificationEvent, { sms: boolean; email: boolean }>;
};

const SettingsPage: FC = () => {
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const [updateSettings] = useUpdateSettings();
  const { control, reset, getValues, watch, handleSubmit } =
    useForm<FormValues>({ mode: "onChange" });
  useEffect(() => {
    if (account) {
      const settings = account.settings;
      const notifications = {} as Record<
        NotificationEvent,
        { sms: boolean; email: boolean }
      >;
      let enablePush = false;
      let enableEmail = false;
      if (!settings) {
        return;
      }
      Object.keys(settings.notifications).forEach((key) => {
        const notification = settings.notifications[key];
        if (notification == "BOTH") {
          notifications[key] = { sms: true, email: true };
          enablePush = true;
          enableEmail = true;
        } else if (notification == "SMS") {
          notifications[key] = { sms: true, email: false };
          enablePush = true;
        } else if (notification == "EMAIL") {
          enableEmail = true;
          notifications[key] = { sms: false, email: true };
        } else if (notification == "NONE") {
          notifications[key] = { sms: false, email: false };
        }
      });
      const values: FormValues = {
        tagging: settings.tagging,
        messaging: settings.messaging,
        emailUnreadMessage: settings.emailUnreadMessage,
        enablePush,
        enableEmail,
        notifications,
      };
      reset(values);
    }
  }, [account, reset]);
  const onSubmit = async (values: FormValues) => {
    try {
      // Set interests empty array when not available.
      const notifications = {} as Record<
        NotificationEvent,
        NotificationMethodEnum
      >;
      Object.keys(values.notifications).forEach((key: NotificationEvent) => {
        const notification = values.notifications[key];
        if (notification.sms && notification.email) {
          notifications[key] = "BOTH";
        } else if (notification.sms) {
          notifications[key] = "SMS";
        } else if (notification.email) {
          notifications[key] = "EMAIL";
        } else {
          notifications[key] = "NONE";
        }
      });
      const settingsInput: SettingsInput = {
        tagging: values.tagging,
        messaging: values.messaging,
        emailUnreadMessage: values.emailUnreadMessage,
        interests: account?.settings?.interests ?? [],
        notifications,
      };
      await updateSettings({ variables: { settings: settingsInput } });
    } catch (e) {
      console.log(e);
    }
  };

  if (!account) {
    return <></>;
  }

  return (
    <div className="px-2 md:px-8 pt-8 pb-20">
      <h1 className="text-white text-2xl">Settings</h1>
      <div className="flex mt-8">
        <div className="flex-grow">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="text-white font-medium px-1">General</div>
              <Card className="border-none mt-2 p-0">
                <div className="px-6 py-5">
                  <div className="flex">
                    <div>
                      <ToggleSwitch
                        name="tagging"
                        control={control}
                        onChange={() => handleSubmit(onSubmit)()}
                      />
                    </div>
                    <div className="ml-7 mt-1">
                      <div className="text-white">Allow tagging</div>
                      <div className="text-xs text-white/[.6] mt-2">
                        If allowed, users may tag you in posts, comments and
                        messages using the @mention feature.
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-7">
              <div className="text-white font-medium px-1">Messaging</div>
              <Card className="border-none mt-2 p-0">
                <div className="divide-y divide-inherit border-white/[.12]">
                  <div className="px-6 py-5">
                    <div className="flex">
                      <div>
                        <ToggleSwitch
                          name="messaging"
                          control={control}
                          onChange={() => handleSubmit(onSubmit)()}
                        />
                      </div>
                      <div className="ml-7 mt-1">
                        <div className="text-white">Allow messages</div>
                        <div className="text-xs text-white/[.6] mt-2">
                          If allowed, users may message you within Prometheus
                          Alts
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <div className="flex items-center">
                      <div>
                        <ToggleSwitch
                          name="emailUnreadMessage"
                          control={control}
                          onChange={() => handleSubmit(onSubmit)()}
                        />
                      </div>
                      <div className="ml-7">
                        <div className="text-white">
                          Receive messages by email
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-9">
              <div className="text-white font-medium px-1">
                Notification Methods
              </div>
              <Card className="border-none mt-2 p-0">
                <div className="grid md:grid-cols-2 gap-8 p-6">
                  <div className="flex flex-col items-center justify-center">
                    <Image src={PushNotificationImage} alt="" height={116} />
                    <div className="flex items-center mt-3">
                      <ToggleSwitch
                        name="enablePush"
                        control={control}
                        onChange={(checked) => {
                          if (!checked) {
                            const values = getValues();
                            const notifications = values.notifications;
                            Object.keys(notifications).forEach((key) => {
                              notifications[key].sms = false;
                            });
                            reset({ ...getValues(), notifications });
                            handleSubmit(onSubmit)();
                          }
                        }}
                      />
                      <div className="ml-7">
                        <div className="text-white">Mobile Push</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Image src={EmailNotificationImage} alt="" height={116} />
                    <div className="flex items-center mt-3">
                      <ToggleSwitch
                        name="enableEmail"
                        control={control}
                        onChange={(checked) => {
                          if (!checked) {
                            const values = getValues();
                            const notifications = values.notifications;
                            Object.keys(notifications).forEach((key) => {
                              notifications[key].email = false;
                            });
                            reset({ ...getValues(), notifications });
                            handleSubmit(onSubmit)();
                          }
                        }}
                      />
                      <div className="ml-7">
                        <div className="text-white">Email</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-6">
              <div className="text-white font-medium px-1">Notifications</div>
              <Card className="border-none mt-2 p-0">
                <div className="divide-y divide-inherit border-white/[.12]">
                  {notificationItems.map((notification, index) => (
                    <div key={index} className="px-6 py-5">
                      <div className="md:flex items-center">
                        <div className="flex-grow mr-3">
                          <div className="text-white">
                            {notification.label}
                          </div>
                          {notification.info && (
                            <div className="text-xs text-white/[.6] mt-2">
                              {notification.info}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center flex-shrink-0">
                          <div className="flex items-center">
                            <div>
                              <ToggleSwitch
                                size={"sm"}
                                name={`notifications.${notification.key}.sms`}
                                control={control}
                                disabled={!watch("enablePush")}
                                onChange={() => handleSubmit(onSubmit)()}
                              />
                            </div>
                            <div className="ml-7">
                              <div
                                className={
                                  watch("enablePush") ? "" : "opacity-60"
                                }
                              >
                                <div className="text-sm text-white">
                                  Mobile Push
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 items-center ml-12">
                            <div>
                              <ToggleSwitch
                                size={"sm"}
                                name={`notifications.${notification.key}.email`}
                                control={control}
                                disabled={!watch("enableEmail")}
                                onChange={() => handleSubmit(onSubmit)()}
                              />
                            </div>
                            <div className="ml-7">
                              <div
                                className={
                                  watch("enablePush") ? "" : "opacity-60"
                                }
                              >
                                <div className="text-sm text-white">Email</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </form>
        </div>
        <div className="w-80 hidden lg:block flex-shrink-0 ml-6">
          {account && (
            <>
              <div className="mt-8">
                <ProfileSettings user={account} />
              </div>
              <div className="mt-8">
                <AdminSettings />
              </div>
            </>
          )}
          <div className="mt-8">
            <InviteFriends />
          </div>
          <div className="mt-8">
            <Card>
              <Link href="https://help.prometheusalts.com/hc/en-us">
                <a>
                  <div className="flex items-center justify-between text-white">
                    <div className="text-md font-medium">Help & Support</div>
                    <CaretRight size={30} color="currentColor" />
                  </div>
                </a>
              </Link>
            </Card>
          </div>
          <div className="mt-8">
            <Card className="">
              <Link href="https://prometheusalts.com/legals/disclosure-library">
                <a>
                  <div className="flex items-center justify-between text-white">
                    <div className="text-md font-medium">
                      Terms & Disclosures
                    </div>
                    <CaretRight size={30} color="currentColor" />
                  </div>
                </a>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
