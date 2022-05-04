import {
  ChannelPreviewUIComponentProps,
  ChatContextValue,
  useChatContext,
} from "stream-chat-react";
import { Channel, ChannelMemberResponse } from "stream-chat";
import dayjs from "dayjs";

import AvatarGroup from "../AvatarGroup";
import { StreamType } from "../types";

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
  const members = Object.values(channel.state.members)
    .filter(({ user }) => user?.id !== client.userID)
    .map(({ user }) => ({
      name: user?.name,
      image: user?.image,
    }));

  return (
    <div
      className={`
        flex items-top rounded-lg cursor-pointer m-4 p-4 
        ${
          channel?.id === activeChannel?.id ? "bg-info/[.24]" : "bg-transparent"
        }
      `}
      onClick={() => {
        setIsCreating(false);
        setActiveChannel?.(channel);
      }}
    >
      <AvatarGroup members={members} />
      <div className="w-full">
        <div className="flex items-top justify-between text-white">
          <div className="w-50 overflow-hidden overflow-ellipsis">
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
