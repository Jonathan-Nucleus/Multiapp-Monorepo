import { ThreadHeaderProps } from "stream-chat-react";
import { XCircle } from "phosphor-react";

const PThreadHeader: React.FC<ThreadHeaderProps> = ({
  closeThread,
  thread,
}) => {
  const getReplyCount = () => {
    if (!thread?.reply_count) return "";
    if (thread.reply_count === 1) return "1 reply";
    return `${thread.reply_count} Replies`;
  };

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center">
        <p className="">Thread</p>
        <p className="ml-2 text-xs">{getReplyCount()}</p>
      </div>
      <XCircle className="cursor-pointer" onClick={closeThread} size={24} />
    </div>
  );
};

export default PThreadHeader;
