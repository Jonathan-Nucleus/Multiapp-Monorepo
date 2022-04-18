import {
  ChannelPreviewUIComponentProps,
  ChatContextValue,
  useChatContext,
} from "stream-chat-react";
import { Channel, ChannelMemberResponse } from "stream-chat";
import dayjs from "dayjs";

import AvatarGroup from "../AvatarGroup";
import { StreamType } from "../types";

type MessagingChannelPreviewProps = ChannelPreviewUIComponentProps & {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessagingChannelPreview: React.FC<MessagingChannelPreviewProps> = ({
  channel,
  lastMessage,
  setActiveChannel,
  setIsCreating,
}) => {
  const { channel: activeChannel, client } = useChatContext<StreamType>();
  const members = Object.values(channel.state.members)
    .filter(({ user }) => user?.id !== client.userID)
    .map(({ user }) => ({
      name: user?.name,
      image: user?.image,
    }));

  return (
    <div
      className={`
        flex items-top rounded-lg cursor-pointer p-4 overflow-hidden w-full
        ${
          channel?.id === activeChannel?.id ? "bg-info/[.24]" : "bg-transparent"
        }
      `}
      onClick={() => {
        setIsCreating(false);
        setActiveChannel?.(channel);
      }}
    >
      <div className="mr-2 flex items-center">
        <AvatarGroup members={members} />
      </div>
      <div className="flex flex-col justify-center overflow-hidden overflow-ellipsis">
        <div className="text-white align-middle">
          {channel.data?.name || members.map((member) => member.name).join(",")}
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
      {lastMessage?.created_at && (
        <div className="text-xs text-white w-10 text-right whitespace-nowrap">
          {dayjs(lastMessage.created_at).format("h:mm A")}
        </div>
      )}
    </div>
  );
};

export default MessagingChannelPreview;
