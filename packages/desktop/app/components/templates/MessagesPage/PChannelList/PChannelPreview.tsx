import React, { useMemo } from "react";
import {
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import dayjs from "dayjs";
import AvatarGroup from "../AvatarGroup";
import { StreamType } from "../types";
import { Circle } from "phosphor-react";

type PChannelPreviewProps = ChannelPreviewUIComponentProps & {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

const PChannelPreview: React.FC<PChannelPreviewProps> = ({
  channel,
  lastMessage,
  setActiveChannel,
  setIsCreating,
}) => {
  const { channel: activeChannel, client } = useChatContext<StreamType>();
  const countUnread = channel?.countUnread() || 0;
  const members = useMemo(() => {
    if (!channel) return [];
    
    return Object.values(channel.state.members)
      .filter(({ user }) => user?.id !== client.userID)
      .map(({ user }) => ({
        name: user?.name,
        image: user?.image,
        online: user?.online,
      }));
  }, [channel, client]);

  return (
    <div
      className={`
        relative flex items-center rounded-lg cursor-pointer p-4 
        ${
          channel?.id === activeChannel?.id ? "bg-info/[.24]" : "bg-transparent"
        }
      `}
      onClick={() => {
        setIsCreating(false);
        setActiveChannel?.(channel);
      }}
    >
      {countUnread > 0 && (
        <div className="mr-2 absolute left-0">
          <Circle weight="fill" color="#F2A63F" size="10" />
        </div>        
      )}
      <AvatarGroup members={members} />
      <div className="w-full">
        <div className="flex items-top justify-between text-white">
          <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {channel.data?.name || members.map((member) => member.name).join(",")}
          </div>
          {lastMessage?.created_at && (
            <div className="text-[11px] w-15 text-right shrink-0 ml-2">
              {dayjs(lastMessage.created_at).format("h:mm A")}
            </div>
          )}
        </div>
        {lastMessage && (
          <div
            className={`text-white/[.5] text-sm whitespace-nowrap
            overflow-ellipsis mr-2 overflow-hidden`}
          >
            {lastMessage.text}
          </div>
        )}        
      </div>
    </div>
  );
};

export default PChannelPreview;
