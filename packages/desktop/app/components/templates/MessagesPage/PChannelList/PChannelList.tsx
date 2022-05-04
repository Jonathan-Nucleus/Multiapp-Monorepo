import { FC, memo, PropsWithChildren } from "react";
import { ChannelListMessengerProps } from "stream-chat-react";
import { SkeletonLoader } from "./SkeletonLoader";

type PChannelListProps = ChannelListMessengerProps & PropsWithChildren<unknown>;

const PChannelList: FC<PChannelListProps> = ({
  children,
  error = false,
  loading,
}) => {
  if (error) {
    return (
      <div className="px-4 text-white">
        Error loading conversations, please try again momentarily.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4">
        <SkeletonLoader />
      </div>
    );
  }

  return <div className="px-4">{children}</div>;
};

export default memo(PChannelList);
