import React, { useEffect, useRef, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import { ChannelMemberResponse } from "stream-chat";

import { TypingIndicator } from "../TypingIndicator";
import { ChannelType, StreamType } from "../types";
import Input from "../../../common/Input";
import AvatarGroup from "../AvatarGroup";
import { ChannelInfoIcon, ChannelSaveIcon, getCleanImage } from "../Icons";

type Props = {
  toggleMobile?: () => void;
  onCreateChannel?: () => void;
};

const MessagingChannelHeader: React.FC<Props> = (props) => {
  const { toggleMobile } = props;

  const { client } = useChatContext<StreamType>();
  const { channel } = useChannelStateContext<StreamType>();

  const [channelName, setChannelName] = useState(channel.data?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const members = Object.values(channel.state?.members).filter(
    (member) => member.user?.id !== client?.user?.id
  );
  const avatarInfo = members.map(({ user }) => ({
    image: user.image,
    name: user.name,
  }));

  const updateChannel = async () => {
    if (channelName && channelName !== channel.data?.name) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef?.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!channelName) {
      setTitle(
        members
          .map(
            (member) => member.user?.name || member.user?.id || "Unnamed User"
          )
          .join(", ")
      );
    }
  }, [channelName, members]);

  const EditHeader = () => (
    <form
      style={{ flex: 1 }}
      onSubmit={(event) => {
        event.preventDefault();
        inputRef?.current?.blur();
      }}
    >
      <Input
        autoFocus
        className="channel-header__edit-input"
        onBlur={updateChannel}
        onChange={(event) => setChannelName(event.target.value)}
        placeholder="Type a new name for the chat"
        ref={inputRef}
        value={channelName}
      />
    </form>
  );

  return (
    <div className="messaging__channel-header px-4 py-4 flex justify-between items-center border-b border-white/[.15]">
      <div className="messaging__channel-header__left flex items-center">
        <AvatarGroup members={avatarInfo} />
        {!isEditing ? (
          <div className="channel-header__name text-white ml-1">
            {channelName || title}
          </div>
        ) : (
          <EditHeader />
        )}
      </div>
      <div className="messaging__channel-header__right">
        <TypingIndicator />
        {!isEditing ? (
          <ChannelInfoIcon {...{ isEditing, setIsEditing }} />
        ) : (
          <ChannelSaveIcon />
        )}
      </div>
    </div>
  );
};

export default React.memo(MessagingChannelHeader);
