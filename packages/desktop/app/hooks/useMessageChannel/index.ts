import { useEffect, useState } from "react";
import type { Channel, ChannelMemberResponse } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import type { StreamType } from "../../types/message";

const USER_PRESENCE_EVENTS = ["user.watching.start", "user.watching.stop", "channel.updated"];

export const useMessageChannel = (channel: Channel<StreamType> | Channel) => {
  const { client } = useChatContext<StreamType>();
  
  const getMembers = () => Object.values(channel.state.members)
    .filter(({ user }) => user?.id !== client.userID);
  
  const [members, setMembers] = useState<ChannelMemberResponse<StreamType>[]>(getMembers());
  const [countUnread, setCountUnread] = useState(channel.countUnread());

  const channelAvatar = members.map(({ user }) => ({
    image: user?.image,
    name: user?.name,
    online: user?.online
  }))

  const channelName = channel.data?.name || members
    .map((member: ChannelMemberResponse) => member?.user?.name || member?.user?.id || "Unnamed User")
    .join(", ");

  useEffect(() => {
    const listener = channel.on((e) => {
      if (USER_PRESENCE_EVENTS.includes(e.type.toLowerCase())) {
        setMembers(getMembers());
      }

      setCountUnread(channel.countUnread());
    });

    return () => {
      listener.unsubscribe();
    }; 
  }, [channel]);

  return { channelName, channelAvatar, members, countUnread };
};
