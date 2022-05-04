import React, { useMemo } from "react";
import {
  MessageList,
  useChatContext,
  useChannelStateContext,
} from "stream-chat-react";
import PMessage from "./PSimpleMessage";
import AvatarGroup from "../AvatarGroup";
import { StreamType } from "../types";

const ACTIONS = ["delete", "edit", "flag", "mute", "react", "reply"];

export const PMessageList: React.FC = () => {
  const { channel, client } = useChatContext<StreamType>();
  const { messages } = useChannelStateContext<StreamType>();

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
    <div className="h-full overflow-y-auto">
      {messages && messages.length > 0 ? (
        <MessageList messageActions={ACTIONS} Message={PMessage} />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <AvatarGroup members={members} size={80} />
          <p className="mt-2 font-bold">{members[0].name}</p>
        </div>
      )}
    </div>
  );
};

export default PMessageList;
