import { FC } from "react";
import { PMessage } from "shared/context/Chat/types";
import { Check } from "phosphor-react";
import dayjs from "dayjs";
import ChatAvatar from "../../ChatAvatar";
import Media from "../../../../common/Media";

interface MessageItemProps {
  message: PMessage;
  isMine: boolean;
}

const MessageItem: FC<MessageItemProps> = ({ message, isMine }) => {
  const attachments = message.attachments ? (
    <div>
      {message.attachments.map((attachment, index) => {
        const { image_url, asset_url } = attachment;
        const mediaUrl = image_url || asset_url;
        if (!mediaUrl) {
          return null;
        }
        return (
          <div
            key={index}
            className="rounded-lg bg-black relative overflow-hidden"
          >
            {attachment.type == "video" && (
              <Media type={"video"} url={mediaUrl} aspectRatio={1} />
            )}
            {attachment.type == "image" && (
              <Media type={"image"} url={mediaUrl} aspectRatio={1} />
            )}
          </div>
        );
      })}
    </div>
  ) : null;
  if (isMine) {
    return (
      <div>
        <div className="max-w-[70%] text-right ml-auto">
          {message.text && (
            <div className="inline-block bg-primary rounded-lg px-4 py-2">
              <div className="text-sm text-white">{message.text}</div>
            </div>
          )}
          {attachments}
          <div className="inline-flex items-center text-white/[.6] mt-1">
            <Check size={24} color="currentColor" className="mr-1.5" />
            <div className="text-xs">
              {dayjs(message.created_at).format("h:mm A")}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex">
        <ChatAvatar size={32} user={message.user} showStatus={false} />
        <div className="flex-grow max-w-[70%] ml-3">
          {message.text && (
            <div className="inline-block bg-secondary-900 rounded-lg px-4 py-2">
              <div className="text-sm text-white">{message.text}</div>
            </div>
          )}
          {attachments}
          <div className="text-white/[.6] mt-1">
            <div className="text-xs">
              {dayjs(message.created_at).format("h:mm A")}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MessageItem;
