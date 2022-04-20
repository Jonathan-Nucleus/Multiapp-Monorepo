import { FC, memo, PropsWithChildren } from "react";
import { ChannelListMessengerProps } from "stream-chat-react";
import { SkeletonLoader } from "./SkeletonLoader";

type MessagingChannelListProps = ChannelListMessengerProps & PropsWithChildren<unknown>;

const MessagingChannelList: FC<MessagingChannelListProps> = ({
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

export default memo(MessagingChannelList);
