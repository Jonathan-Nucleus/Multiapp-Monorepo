import { FC } from "react";
import { Channel } from "shared/context/Chat/types";
import { useAccountContext } from "shared/context/Account";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ChatAvatar from "../../ChatAvatar";
import { channelName } from "shared/context/Chat/utils";

dayjs.extend(relativeTime);

interface ChannelItemProps {
  channel: Channel;
  selected: boolean;
  onSelect: () => void;
}

const ChannelItem: FC<ChannelItemProps> = ({ channel, selected, onSelect }) => {
  const account = useAccountContext();
  const lastMessage = channel.lastMessage();
  return (
    <div
      className="bg-background rounded-lg overflow-hidden cursor-pointer"
      onClick={onSelect}
    >
      <div className={`${selected ? "bg-primary-overlay/[.24]" : ""} relative`}>
        <div className="flex items-center p-4">
          <ChatAvatar size={48} members={channel.state.members} />
          <div className="flex-grow min-w-0 ml-4">
            <div className="flex">
              <div className="text-white truncate mr-5">
                {channelName(channel, account._id)}
              </div>
              {lastMessage && (
                <div className="flex-shrink-0 text-tiny text-white ml-auto">
                  {dayjs(lastMessage.created_at).fromNow(true)}
                </div>
              )}
            </div>
            <div className="text-sm text-white/[.5] truncate">
              {lastMessage?.text}
            </div>
          </div>
          {channel.state.unreadCount > 0 && (
            <div className="w-2 h-2 absolute left-0.5 bg-yellow rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelItem;
