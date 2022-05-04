import React, { useEffect, useRef, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";

import { TypingIndicator } from "../TypingIndicator";
import Input from "../../../common/Input";
import AvatarGroup from "../AvatarGroup";
import { ArrowLeft, CheckCircle, DotsThreeOutlineVertical } from "phosphor-react";

type Props = {
  toggleMobile?: () => void;
  onCreateChannel?: () => void;
};

const PChannelHeader: React.FC<Props> = (props) => {
  const { toggleMobile } = props;

  const { client } = useChatContext();
  const { channel } = useChannelStateContext();

  const [channelName, setChannelName] = useState(channel.data?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const members = Object.values(channel.state?.members).filter(
    (member) => member.user?.id !== client?.user?.id
  );
  const avatarInfo = members.map(({ user }) => ({
    image: user?.image,
    name: user?.name,
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
        className="h-12"
        onBlur={updateChannel}
        onChange={(event) => setChannelName(event.currentTarget.value)}
        placeholder="Type a new name for the chat"
        ref={inputRef}
        value={channelName}
      />
    </form>
  );

  return (
    <div className="px-4 py-4 flex justify-between items-center border-b border-white/[.15]">
      <div className="flex items-center">
        <div className="mobile-nav-icon cursor-pointer mr-2" onClick={toggleMobile}>
          <ArrowLeft size="32" />
        </div>
        <AvatarGroup members={avatarInfo} />
        {!isEditing ? (
          <div className="text-white ml-1">
            {channelName || title}
          </div>
        ) : (
          <EditHeader />
        )}
      </div>
      <div className="flex items-center">
        <TypingIndicator />
        {!isEditing ? (
          <DotsThreeOutlineVertical className="cursor-pointer" size="24" onClick={() => setIsEditing(true)} />
        ) : (
          <CheckCircle className="cursor-pointer" size="32" />
        )}
      </div>
    </div>
  );
};

export default React.memo(PChannelHeader);
