import React, { useState } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { useMessageChannel } from "../../../../../hooks/useMessageChannel";
import { TypingIndicator } from "../../TypingIndicator";
import AvatarGroup from "../../AvatarGroup";
import { ArrowLeft, DotsThreeOutlineVertical } from "phosphor-react";
import PChannelEdit from "./PChannelEdit";

type Props = {
  toggleMobile?: () => void;
  onCreateChannel?: () => void;
};

const PChannelHeader: React.FC<Props> = (props) => {
  const { toggleMobile } = props;

  const { channel } = useChannelStateContext();
  const { channelName, channelAvatar } = useMessageChannel(channel);

  return (
    <div className="px-4 py-4 flex justify-between items-center border-b border-white/[.15]">
      <div className="flex items-center">
        <div
          className="mobile-nav-icon cursor-pointer mr-2"
          onClick={toggleMobile}
        >
          <ArrowLeft size="32" />
        </div>
        <AvatarGroup members={channelAvatar} />
        <div className="text-white ml-1">{channelName}</div>
      </div>
    </div>
  );
};

export default React.memo(PChannelHeader);
