import React, { useEffect } from "react";
import { ChannelListMessengerProps, useChatContext } from "stream-chat-react";
import { SkeletonLoader } from "./SkeletonLoader";
import { StreamType } from "../types";

const MessagingChannelList: React.FC<ChannelListMessengerProps> = ({
  children,
  error = false,
  loading,
}) => {
  if (error) {
    return (
      <div className="messaging__channel-list__message">
        Error loading conversations, please try again momentarily.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="messaging__channel-list__message">
        <SkeletonLoader />
      </div>
    );
  }

  return <>{children}</>;
};

export default React.memo(MessagingChannelList);
