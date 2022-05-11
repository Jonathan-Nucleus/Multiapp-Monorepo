import React from "react";
import { MessageList, useChannelStateContext } from "stream-chat-react";
import { useMessageChannel } from "../../../../hooks/useMessageChannel";
import PMessageSimple from "./PMessageSimple";
import AvatarGroup from "../AvatarGroup";
import { StreamType } from "../../../../types/message";

const ACTIONS = ["delete", "edit", "flag", "mute", "react", "reply"];

export const PMessageList: React.FC = () => {
  const { channel, messages } = useChannelStateContext<StreamType>();
  const { channelAvatar } = useMessageChannel(channel);

  return (
    <div className="h-full overflow-y-auto">
      {messages && messages.length > 0 ? (
        <MessageList messageActions={ACTIONS} Message={PMessageSimple} />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <AvatarGroup members={channelAvatar} size={65} />
          <p className="mt-2 font-bold">{channelAvatar[0].name}</p>
        </div>
      )}
    </div>
  );
};

export default PMessageList;
