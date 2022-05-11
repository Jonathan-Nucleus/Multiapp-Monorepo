import React from "react";
import {
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import dayjs from "dayjs";
import { useMessageChannel } from "../../../../hooks/useMessageChannel";
import AvatarGroup from "../AvatarGroup";
import { StreamType } from "../../../../types/message";
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
  const { channel: activeChannel } = useChatContext<StreamType>();
  const { channelName, channelAvatar, countUnread } =
    useMessageChannel(channel);

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
      <AvatarGroup members={channelAvatar} />
      <div className="w-full">
        <div className="flex items-top justify-between text-white">
          <div className="max-w-[150px] overflow-hidden overflow-ellipsis whitespace-nowrap">
            {channelName}
          </div>
          {lastMessage?.created_at && (
            <div className="text-[11px] w-15 text-right shrink-0 ml-2">
              {dayjs(lastMessage.created_at).format("h:mm A")}
            </div>
          )}
        </div>
        {lastMessage && (
          <div
            className={`max-w-[150px] text-white/[.5] text-sm whitespace-nowrap
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
